const dashboardService = require('../services/dashboard.service');

exports.obtenerClientesFrecuentes = async (req, res, next) => {
    try {
        const { fechaInicio, fechaFin, codCiudad } = req.body;
        
        if (!fechaInicio || !fechaFin || !codCiudad) {
            return res.status(400).json({ error: 'Faltan parámetros requeridos' });
        }

        const estadisticas = await dashboardService.obtenerClientesFrecuentes(
            fechaInicio,
            fechaFin,
            codCiudad
        );
        
        res.json(estadisticas);
    } catch (error) {
        next(error);
    }
};

exports.obtenerPicosDemanda = async (req, res, next) => {
    try {
        const { anio, codCiudad } = req.body;
        
        if (!anio || !codCiudad) {
            return res.status(400).json({ 
                error: 'Parámetros requeridos: anio y codCiudad' 
            });
        }

        const resultados = await dashboardService.obtenerPicosDemanda(
            parseInt(anio),
            parseInt(codCiudad)
        );
        
        res.json({
            año: anio,
            ciudad: codCiudad,
            picos_demanda: resultados
        });
    } catch (error) {
        next(error);
    }
};

exports.obtenerPatronesConsumo = async (req, res, next) => {
    try {
        const { periodo, fechaInicio, fechaFin, codCiudad, codArt } = req.body;
        
        // Validación de parámetros
        const periodosValidos = ['diario', 'mensual', 'trimestral', 'anual'];
        if (!periodosValidos.includes(periodo)) {
            return res.status(400).json({ error: 'Periodo no válido' });
        }

        const resultados = await dashboardService.obtenerPatronesConsumo({
            periodo,
            fechaInicio,
            fechaFin,
            codCiudad,
            codArt
        });

        res.json({
            meta: {
                periodo_analizado: periodo,
                rango_fechas: `${fechaInicio} - ${fechaFin}`,
                filtros_aplicados: {
                    ciudad: codCiudad || 'Todas',
                    articulo: codArt || 'Todos'
                }
            },
            data: resultados
        });
    } catch (error) {
        next(error);
    }
};

exports.obtenerKPIs = async (req, res, next) => {
    try {
        const { año, mes, codCiudad } = req.body;
        
        if (!año || !mes) {
            return res.status(400).json({ error: 'Se requieren año y mes' });
        }

        const kpis = await dashboardService.obtenerKPIsSimplificado({
            año: parseInt(año),
            mes: parseInt(mes),
            codCiudad
        });

        res.json({
            meta: { año, mes, ciudad: codCiudad || 'Todas' },
            data: kpis
        });
    } catch (error) {
        next(error);
    }
};
exports.obtenerDistribucionVentas = async (req, res, next) => {
    try {
        const { año, cod_art, cod_ciudad } = req.body;
        
        // Validación básica
        if (!año && !cod_art) {
            return res.status(400).json({ 
                error: 'Se requiere al menos un año o un producto' 
            });
        }

        const distribucion = await dashboardService.obtenerDistribucionVentas({
            año: año ? parseInt(año) : null,
            cod_art,
            cod_ciudad
        });

        res.json({
            meta: {
                año: año || 'Todos',
                producto: cod_art || 'Todos',
                ciudad_filtro: cod_ciudad || 'Todas'
            },
            data: distribucion
        });
    } catch (error) {
        next(error);
    }
};

exports.obtenerEstadisticasGenerales = async (req, res, next) => {
    try {
        const estadisticas = await dashboardService.obtenerEstadisticasGenerales();
        res.json({
            exito: true,
            data: estadisticas
        });
    } catch (error) {
        next(error);
    }
};