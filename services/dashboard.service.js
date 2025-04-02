const pool = require('../config/db');

class DashboardService {
    async obtenerClientesFrecuentes(fechaInicio, fechaFin, codCiudad) {
        const sql = `
            SELECT 
                c.cod_cliente,
                c.nom_cliente,
                COUNT(p.id_pedido) AS total_pedidos
            FROM pedidos p
            INNER JOIN clientes c 
                ON p.cod_cliente = c.cod_cliente
            WHERE 
                p.fecha_pedido BETWEEN ? AND ?
                AND c.cod_ciudad = ?
            GROUP BY 
                c.cod_cliente,
                c.nom_cliente
            ORDER BY 
                total_pedidos DESC
        `;

        const [result] = await pool.query(sql, [fechaInicio, fechaFin, codCiudad]);
        return result;
    }
    async obtenerPicosDemanda(anio, codCiudad) {
        const sql = `
            WITH demanda_diaria AS (
                SELECT 
                    m.emision AS fecha,
                    a.cod_art,
                    a.nombre_art,
                    COUNT(df.id_detalle) AS total_facturas
                FROM maestro_facturas m
                INNER JOIN detalle_facturas df ON m.factura = df.factura
                INNER JOIN articulos a ON df.cod_art = a.cod_art
                WHERE YEAR(m.emision) = ?
                    AND m.cod_ciudad = ?
                GROUP BY m.emision, a.cod_art, a.nombre_art
            ),
            estadisticas AS (
                SELECT 
                    cod_art,
                    AVG(total_facturas) AS media,
                    STDDEV(total_facturas) AS desv_estandar
                FROM demanda_diaria
                GROUP BY cod_art
            )
            SELECT 
                dd.fecha,
                dd.cod_art,
                dd.nombre_art,
                dd.total_facturas,
                e.media,
                ROUND(e.desv_estandar, 2) AS desv_estandar,
                ROUND((e.media + 2 * e.desv_estandar), 2) AS umbral
            FROM demanda_diaria dd
            INNER JOIN estadisticas e ON dd.cod_art = e.cod_art
            WHERE dd.total_facturas > (e.media + 2 * e.desv_estandar)
            ORDER BY dd.fecha DESC;
        `;

        const [result] = await pool.query(sql, [anio, codCiudad]);
        return result;
    }
    async obtenerPatronesConsumo(filtros) {
        const { periodo, fechaInicio, fechaFin, codCiudad, codArt } = filtros;

        // Mapeo de periodos a funciones de fecha
        const formatosFecha = {
            'diario': '%Y-%m-%d',
            'mensual': '%Y-%m',
            'trimestral': '%Y-QUARTER %q',
            'anual': '%Y'
        };

        const sql = `
            SELECT
                DATE_FORMAT(m.emision, ?) AS periodo,
                a.cod_art,
                a.nombre_art,
                SUM(df.cantidad) AS total_unidades,
                SUM(df.cantidad * df.precio) AS total_ventas,
                COUNT(DISTINCT m.factura) AS total_facturas
            FROM maestro_facturas m
            INNER JOIN detalle_facturas df ON m.factura = df.factura
            INNER JOIN articulos a ON df.cod_art = a.cod_art
            WHERE m.emision BETWEEN ? AND ?
                ${codCiudad ? 'AND m.cod_ciudad = ?' : ''}
                ${codArt ? 'AND a.cod_art = ?' : ''}
            GROUP BY periodo, a.cod_art, a.nombre_art
            ORDER BY periodo ASC;  
        `;

        const params = [
            formatosFecha[periodo],
            fechaInicio,
            fechaFin,
            ...(codCiudad ? [codCiudad] : []),
            ...(codArt ? [codArt] : [])
        ].filter(p => p !== undefined);

        const [result] = await pool.query(sql, params);
        return this.formatearSalida(result, periodo);
    }

    formatearSalida(data, periodo) {
        // Agregar metadatos de formato de periodo
        return data.map(item => ({
            ...item,
            tipo_periodo: periodo,
            total_ventas: parseFloat(item.total_ventas),
            detalles_periodo: this.obtenerDetallePeriodo(item.periodo, periodo)
        }));
    }

    obtenerDetallePeriodo(periodoStr, tipo) {
        const [year, part] = periodoStr.split('-');
        if (tipo === 'trimestral') {
            return { año: year, trimestre: parseInt(part.replace('QUARTER ', '')) };
        }
        if (tipo === 'mensual') return { año: year, mes: parseInt(part) };
        if (tipo === 'anual') return { año: year };
        return { fecha: periodoStr }; // Diario
    }
    async obtenerKPIsSimplificado(filtros) {
        const { año, mes, codCiudad } = filtros;

        const sql = `
          SELECT
            -- Ventas totales y facturación
            IFNULL(SUM(df.cantidad * df.precio), 0) AS ventas_totales,
            COUNT(DISTINCT mf.factura) AS total_facturas,
            COUNT(DISTINCT mf.cod_cliente) AS clientes_activos,
            
            -- Unidades vendidas
            IFNULL(SUM(df.cantidad), 0) AS unidades_vendidas,
            
            -- Unidades pedidas (pedidos y detalle pedidos)
            (
              SELECT IFNULL(SUM(dp.cantidad), 0)
              FROM pedidos p
              INNER JOIN detalle_pedidos dp ON p.id_pedido = dp.id_pedido
              INNER JOIN clientes cl ON p.cod_cliente = cl.cod_cliente
              WHERE YEAR(p.fecha_pedido) = ? 
                AND MONTH(p.fecha_pedido) = ?
                ${codCiudad ? 'AND cl.cod_ciudad = ?' : ''}
            ) AS unidades_pedidas,
            
            -- Total de pedidos
            (
              SELECT COUNT(*)
              FROM pedidos p
              INNER JOIN clientes cl ON p.cod_cliente = cl.cod_cliente
              WHERE YEAR(p.fecha_pedido) = ? 
                AND MONTH(p.fecha_pedido) = ?
                ${codCiudad ? 'AND cl.cod_ciudad = ?' : ''}
            ) AS total_pedidos,
            
            -- Productos destacados
            (
              SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                  'codigo', sub.codigo,
                  'nombre', sub.nombre,
                  'unidades', sub.unidades
                )
              )
              FROM (
                SELECT 
                  df2.cod_art AS codigo,
                  a.nombre_art AS nombre,
                  SUM(df2.cantidad) AS unidades
                FROM detalle_facturas df2
                INNER JOIN maestro_facturas mf2 ON df2.factura = mf2.factura
                INNER JOIN articulos a ON df2.cod_art = a.cod_art
                WHERE YEAR(mf2.emision) = ? 
                  AND MONTH(mf2.emision) = ?
                  ${codCiudad ? 'AND mf2.cod_ciudad = ?' : ''}
                GROUP BY df2.cod_art
                ORDER BY unidades DESC
                LIMIT 5
              ) sub
            ) AS top_productos
            
          FROM maestro_facturas mf
          INNER JOIN detalle_facturas df ON mf.factura = df.factura
          WHERE YEAR(mf.emision) = ? 
            AND MONTH(mf.emision) = ?
            ${codCiudad ? 'AND mf.cod_ciudad = ?' : ''}
        `;

        const params = [];

        // 1) Parámetros para subconsulta: unidades_pedidas
        params.push(año, mes);
        if (codCiudad) params.push(codCiudad);

        // 2) Parámetros para subconsulta: total_pedidos
        params.push(año, mes);
        if (codCiudad) params.push(codCiudad);

        // 3) Parámetros para subconsulta: productos destacados
        params.push(año, mes);
        if (codCiudad) params.push(codCiudad);

        // 4) Parámetros para la consulta principal (maestro_facturas y detalle_facturas)
        params.push(año, mes);
        if (codCiudad) params.push(codCiudad);

        const [result] = await pool.query(sql, params);
        return this.formatearKpis(result[0], año, mes);
    }

    formatearKpis(data, año, mes) {
        return {
            periodo: `${mes}/${año}`,
            ventas_totales: Number(data.ventas_totales) || 0,
            total_facturas: data.total_facturas || 0,
            clientes_activos: data.clientes_activos || 0,
            ratio_venta_por_cliente: data.clientes_activos > 0
                ? (Number(data.ventas_totales) / data.clientes_activos).toFixed(2)
                : 0,
            unidades_vendidas: Number(data.unidades_vendidas) || 0,
            unidades_pedidas: Number(data.unidades_pedidas) || 0,
            ratio_entrega: data.unidades_pedidas > 0
                ? (Number(data.unidades_vendidas) / Number(data.unidades_pedidas)).toFixed(2)
                : 0,
            total_pedidos: data.total_pedidos || 0,
            ticket_promedio: data.total_pedidos > 0
                ? (Number(data.ventas_totales) / data.total_pedidos).toFixed(2)
                : 0,
            top_productos: data.top_productos 
                ? (typeof data.top_productos === 'string' 
                    ? JSON.parse(data.top_productos) 
                    : data.top_productos)
                : []
        };
    }
    async obtenerDistribucionVentas(filtros) {
        const { año, cod_art, cod_ciudad } = filtros;
        
        const sql = `
            SELECT
                c.cod_ciudad,
                ciu.nombre_ciudad,
                p.cod_provincia,  
                p.nombre_provincia,  
                SUM(df.cantidad * df.precio) AS ventas_totales,
                SUM(df.cantidad) AS unidades_vendidas,
                COUNT(DISTINCT mf.factura) AS total_transacciones
            FROM maestro_facturas mf
            INNER JOIN detalle_facturas df ON mf.factura = df.factura
            INNER JOIN clientes c ON mf.cod_cliente = c.cod_cliente
            INNER JOIN ciudades ciu ON c.cod_ciudad = ciu.cod_ciudad
            INNER JOIN provincias p ON ciu.cod_provincia = p.cod_provincia  
            WHERE 1=1
                ${año ? 'AND YEAR(mf.emision) = ?' : ''}
                ${cod_art ? 'AND df.cod_art = ?' : ''}
                ${cod_ciudad ? 'AND c.cod_ciudad = ?' : ''}
            GROUP BY c.cod_ciudad
            ORDER BY ventas_totales DESC;
        `;

        const params = [];
        if (año) params.push(año);
        if (cod_art) params.push(cod_art);
        if (cod_ciudad) params.push(cod_ciudad);

        const [result] = await pool.query(sql, params);
        return this.formatearDistribucion(result);
    }

    formatearDistribucion(data) {
        return data.map(item => ({
            ciudad: {
                codigo: item.cod_ciudad,
                nombre: item.nombre_ciudad,
                provincia: {  // Nueva estructura
                    codigo: item.cod_provincia,
                    nombre: item.nombre_provincia
                }
            },
            metricas: {
                ventas_totales: Number(item.ventas_totales) || 0,
                unidades_vendidas: Number(item.unidades_vendidas) || 0,
                transacciones: item.total_transacciones
            }
        }));
    }
    async obtenerEstadisticasGenerales() {
        const sql = `
            SELECT
                -- Ventas totales
                (SELECT SUM(df.cantidad * df.precio) 
                FROM detalle_facturas df) AS ventas_totales,
                
                -- Clientes activos
                (SELECT COUNT(DISTINCT cod_cliente) 
                FROM maestro_facturas) AS clientes_activos,
                
                -- Total productos vendidos
                (SELECT SUM(cantidad) 
                FROM detalle_facturas) AS productos_vendidos,
                
                -- Producto más vendido (versión corregida)
                (SELECT a.nombre_art
                 FROM detalle_facturas df
                 INNER JOIN articulos a ON df.cod_art = a.cod_art
                 GROUP BY df.cod_art
                 ORDER BY SUM(df.cantidad) DESC
                 LIMIT 1) AS producto_mas_vendido,
                
                -- Unidades vendidas del top producto
                (SELECT SUM(cantidad)
                 FROM detalle_facturas
                 WHERE cod_art = (
                     SELECT cod_art
                     FROM detalle_facturas
                     GROUP BY cod_art
                     ORDER BY SUM(cantidad) DESC
                     LIMIT 1
                 )) AS unidades_vendidas_top
        `;

        const [result] = await pool.query(sql);
        return this.formatearResultado(result[0]);
    }

    formatearResultado(data) {
        return {
            ventas_totales: Number(data.ventas_totales) || 0,
            clientes_activos: data.clientes_activos || 0,
            productos_vendidos: data.productos_vendidos || 0,
            producto_mas_vendido: data.producto_mas_vendido || 'N/A',
            unidades_vendidas: data.unidades_vendidas_top || 0
        };
    }
}

module.exports = new DashboardService();