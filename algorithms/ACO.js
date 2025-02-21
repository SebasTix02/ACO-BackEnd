class ACO {
    constructor() {
        this.mejorRuta = null;
        this.mejorDistancia = Infinity;
        this.mejorDuracion = Infinity;
        this.distancias = null;
        this.duraciones = null;
        this.nCiudades = 0;
        this.feromona = null;
    }

    inicializar(matrizDistancias, matrizDuraciones) {
        this.distancias = matrizDistancias;
        this.duraciones = matrizDuraciones;
        this.nCiudades = matrizDistancias.length;
        this.feromona = Array(this.nCiudades).fill().map(() => Array(this.nCiudades).fill(0.1));
        for (let i = 0; i < this.nCiudades; i++) {
            this.feromona[i][i] = 0;
        }
    }

    calcularProbabilidadTransicion(actual, noVisitadas, beta, q0) {
        if (noVisitadas.length === 0) return null;
        const distanciasNoVisitadas = noVisitadas.map(i => this.distancias[actual][i]);
        const eta = distanciasNoVisitadas.map(d => 1.0 / (d + 1e-10));
        const probabilidades = noVisitadas.map((u, i) => this.feromona[actual][u] * Math.pow(eta[i], beta));

        if (Math.random() < q0) {
            return noVisitadas[probabilidades.indexOf(Math.max(...probabilidades))];
        } else {
            const sumaProbabilidades = probabilidades.reduce((a, b) => a + b, 0);
            const probabilidadesNormalizadas = probabilidades.map(p => p / sumaProbabilidades);
            let rand = Math.random();
            for (let i = 0; i < probabilidadesNormalizadas.length; i++) {
                rand -= probabilidadesNormalizadas[i];
                if (rand <= 0) return noVisitadas[i];
            }
        }
    }

    actualizarFeromonaLocal(i, j, zeta) {
        this.feromona[i][j] = (1 - zeta) * this.feromona[i][j] + zeta * 0.1;
        this.feromona[j][i] = this.feromona[i][j];
    }

    actualizarFeromonaGlobal(mejorRuta, mejorDistancia, rho) {
        this.feromona = this.feromona.map(fila => fila.map(p => (1 - rho) * p));
        const deltaTau = 1.0 / mejorDistancia;
        for (let i = 0; i < mejorRuta.length - 1; i++) {
            const actual = mejorRuta[i];
            const siguiente = mejorRuta[i + 1];
            this.feromona[actual][siguiente] += rho * deltaTau;
            this.feromona[siguiente][actual] = this.feromona[actual][siguiente];
        }
    }

    construirSolucion(inicio, beta, zeta, q0) {
        let actual = inicio;
        const ruta = [actual];
        let distanciaTotal = 0;
        let duracionTotal = 0;
        const noVisitadas = Array.from({ length: this.nCiudades }, (_, i) => i).filter(i => i !== actual);

        while (noVisitadas.length > 0) {
            const siguienteCiudad = this.calcularProbabilidadTransicion(actual, noVisitadas, beta, q0);
            if (siguienteCiudad === null) break;
            ruta.push(siguienteCiudad);
            distanciaTotal += this.distancias[actual][siguienteCiudad];
            duracionTotal += this.duraciones[actual][siguienteCiudad];
            this.actualizarFeromonaLocal(actual, siguienteCiudad, zeta);
            actual = siguienteCiudad;
            noVisitadas.splice(noVisitadas.indexOf(actual), 1);
        }

        ruta.push(ruta[0]);
        distanciaTotal += this.distancias[actual][ruta[0]];
        duracionTotal += this.duraciones[actual][ruta[0]];

        return { ruta, distanciaTotal, duracionTotal };
    }

    ajustar(matrizDistancias, matrizDuraciones, nHormigas, maxIteraciones, beta, zeta, rho, q0, verbose) {
        this.inicializar(matrizDistancias, matrizDuraciones);

        for (let iteracion = 0; iteracion < maxIteraciones; iteracion++) {
            let mejorDistanciaIteracion = Infinity;
            let mejorDuracionIteracion = Infinity;
            let mejorRutaIteracion = null;

            for (let hormiga = 0; hormiga < nHormigas; hormiga++) {
                const ciudadInicio = 0;
                const { ruta, distanciaTotal, duracionTotal } = this.construirSolucion(ciudadInicio, beta, zeta, q0);

                if (distanciaTotal < mejorDistanciaIteracion) {
                    mejorDistanciaIteracion = distanciaTotal;
                    mejorDuracionIteracion = duracionTotal;
                    mejorRutaIteracion = ruta;
                }
            }

            if (mejorDistanciaIteracion < this.mejorDistancia) {
                this.mejorDistancia = mejorDistanciaIteracion;
                this.mejorDuracion = mejorDuracionIteracion;
                this.mejorRuta = mejorRutaIteracion;
            }

            this.actualizarFeromonaGlobal(this.mejorRuta, this.mejorDistancia, rho);

            if (verbose && (iteracion + 1) % 10 === 0) {
                console.log(`Iteración ${iteracion + 1}/${maxIteraciones}, Mejor distancia: ${this.mejorDistancia.toFixed(2)} km, Mejor duración: ${this.mejorDuracion.toFixed(2)} seg`);
            }
        }

        return { mejorRuta: this.mejorRuta, mejorDistancia: this.mejorDistancia, mejorDuracion: this.mejorDuracion };
    }
}

module.exports = ACO;