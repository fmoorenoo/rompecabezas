document.addEventListener("DOMContentLoaded", () => {

    class Rompecabezas {
        constructor() {
            // Referencias a elementos del DOM
            this.btnInicio = document.getElementById("btn-inicio");
            this.btnGuardar = document.getElementById("btn-guardar");
            this.btnCargar = document.getElementById("btn-cargar");
            this.tabla = document.querySelector("table");
            this.divMovimientos = document.querySelector(".movimientos");
            this.divTiempo = document.getElementById("tiempo");
            this.datosTabla = document.getElementById("datos-tabla");
            this.boxVictoria = document.getElementById("victoria");
            this.msgVictoria = document.getElementById("msg-victoria");

            // Estados iniciales
            this.movimientos = 0;
            this.control = null;
            this.resultados = [];
            this.iniciado = false;
            this.btnGuardar.disabled = true;

            // Almacenar solución (las 8 imágenes en orden)
            this.solucionImagenes = [];
            const imagenes = document.querySelectorAll("td img");
            for (let i = 0; i < imagenes.length - 1; i++) {
                this.solucionImagenes.push(imagenes[i].src);
            }

            // Posición inicial del hueco (fuera de la tabla para no poder intercambiar al inicio)
            this.huecoR = 10;
            this.huecoC = 10;

            // Cronómetro
            this.centesimas = 0; this.segundos = 0; this.minutos = 0;

            // Listeners
            this.btnInicio.addEventListener("click", () => {
                if (!this.iniciado) {
                    this.iniciado = true;
                }
                this.btnInicio.textContent = "Reiniciar";
                this.btnGuardar.disabled = false;
                this.reiniciarJuego();
            });

            // Guardar estado de una partida
            this.btnGuardar.addEventListener("click", () => {
                clearInterval(this.control);

                const celdas = [];
                for (let r = 0; r < 3; r++) {
                    for (let c = 0; c < 3; c++) {
                        const td = document.getElementById(`${r}-${c}`);
                        const img = td.querySelector("img");
                        if (img) {
                            celdas.push({ r, c, src: img.getAttribute("src"), alt: img.getAttribute("alt") });
                        } else {
                            celdas.push({ r, c, empty: true });
                        }
                    }
                }

                const estado = {
                    movimientos: this.movimientos,
                    tiempo: { minutos: this.minutos, segundos: this.segundos, centesimas: this.centesimas },
                    hueco: { r: this.huecoR, c: this.huecoC },
                    celdas: celdas
                };
                localStorage.setItem("partidaGuardada", JSON.stringify(estado));
                console.log("Partida guardada", estado);

                this.mostrarImagenCompleta();
                this.actualizarBotonCargar();
            });

            // Cargar una partida guardada
            this.btnCargar.addEventListener("click", () => {
                const cargar = localStorage.getItem("partidaGuardada");

                let partidaGuardada;
                try {
                    partidaGuardada = JSON.parse(cargar);
                } catch (e) {
                    return;
                }

                const celdas = partidaGuardada.celdas || [];
                for (const celda of celdas) {
                    const td = document.getElementById(`${celda.r}-${celda.c}`);
                    if (celda.empty) {
                        td.innerHTML = '<p class="hueco"></p>';
                    } else {
                        const src = celda.src || (celda.alt ? `images/${celda.alt}.png` : "");
                        const partes = src.split("/");
                        const nombre = partes[partes.length - 1];
                        const alt = celda.alt || (src ? nombre.replace(".png", "") : "");
                        td.innerHTML = `<img src="${src}" alt="${alt}">`;
                    }

                }

                // Hueco
                if (partidaGuardada.hueco) {
                    this.huecoR = Number(partidaGuardada.hueco.r);
                    this.huecoC = Number(partidaGuardada.hueco.c);
                } else {
                    this.huecoR = 2; this.huecoC = 2;
                }

                // Movimientos
                this.movimientos = Number(partidaGuardada.movimientos || 0);
                this.divMovimientos.textContent = this.movimientos;

                // Tiempo 
                this.minutos = Number(partidaGuardada?.tiempo?.minutos || 0);
                this.segundos = Number(partidaGuardada?.tiempo?.segundos || 0);
                this.centesimas = Number(partidaGuardada?.tiempo?.centesimas || 0);

                this.actualizarTiempo();

                clearInterval(this.control);
                this.control = setInterval(() => this.cronometro(), 10);

                if (!this.iniciado) this.iniciado = true;
                this.btnInicio.textContent = "Reiniciar";
                this.btnGuardar.disabled = false;
                this.actualizarBotonCargar();
            });

            // Evento al hacer 'mousedown' en la tabla
            this.tabla.addEventListener("mousedown", (e) => {
                // Detectar el td clicado
                const td = e.target.closest("td");
                if (!td) return;

                const partes = td.id.split("-");
                let r = Number(partes[0]), c = Number(partes[1]);
                if (this.intercambiar(r, c, this.huecoR, this.huecoC)) {
                    this.movimientos++;
                    this.divMovimientos.textContent = this.movimientos;
                    this.huecoR = r;
                    this.huecoC = c;
                }

                // Comprobar si ha ganado
                if (this.puzzleResuelto()) {
                    this.pararContador();

                    // Colocar la última pieza para mostrar la imagen completa.
                    const ultimaCelda = document.getElementById("2-2");
                    const img = document.createElement("img");
                    img.src = "images/2_2.png";
                    img.alt = "2_2";
                    ultimaCelda.innerHTML = "";
                    ultimaCelda.appendChild(img);

                    this.btnInicio.textContent = "Iniciar";

                    this.huecoR = 10;
                    this.huecoC = 10;

                    // Guardar puntuación
                    const totalCent = this.minutos * 6000 + this.segundos * 100 + this.centesimas;
                    this.resultados.push({ tiempoTexto: this.divTiempo.textContent, movimientos: this.movimientos, tiempo: totalCent });
                    localStorage.setItem("marcadorPuzzle", JSON.stringify(this.resultados));
                    this.actualizarTabla();

                    if (this.boxVictoria && this.msgVictoria) {
                        this.msgVictoria.textContent = `¡Has ganado! Tiempo: ${this.divTiempo.textContent} Movimientos: ${this.movimientos}`;
                        this.boxVictoria.style.display = "block";
                    }

                    // Borrar partida guardada al ganar
                    localStorage.removeItem("partidaGuardada");
                    this.actualizarBotonCargar();
                    this.btnGuardar.disabled = true;

                    // Librería de JavaScript para simular confetis al ganar
                    confetti({
                        particleCount: 150,
                        spread: 100,
                        origin: { y: 0.6 }
                    });
                }
            });


            // Cargar y guardar puntuaciones con localStorage
            const guardado = localStorage.getItem("marcadorPuzzle");
            if (guardado) {
                try {
                    this.resultados = JSON.parse(guardado);
                } catch {
                    this.resultados = [];
                }
            }

            this.actualizarBotonCargar();
            this.actualizarTabla();
        }

        actualizarBotonCargar() {
            try {
                const partida = JSON.parse(localStorage.getItem("partidaGuardada"));
                this.btnCargar.disabled = !partida;
            } catch {
                this.btnCargar.disabled = true;
            }
        }

        // Si dos celdas son intercambiables, las intercambia
        intercambiar(r1, c1, r2, c2) {
            const intercambiables =
                (r1 === r2 && (c1 === c2 + 1 || c1 === c2 - 1)) ||
                (c1 === c2 && (r1 === r2 + 1 || r1 === r2 - 1));

            // Si no son intercambiables, no se hace nada
            if (!intercambiables) return false;

            // Intercambiar las celdas
            const A = document.getElementById(`${r1}-${c1}`);
            const B = document.getElementById(`${r2}-${c2}`);
            const temp = A.innerHTML;
            A.innerHTML = B.innerHTML;
            B.innerHTML = temp;

            return true;
        }

        contarInversiones(listaSrc) {
            let inversiones = 0;
            for (let i = 0; i < listaSrc.length; i++) {
                // Obtener fila y columna (ej: images/0_2.png -> r=0; c=2)
                const partesI = listaSrc[i].split('/')
                const nombreI = partesI[partesI.length - 1].replace(".png", "");
                const [rI, cI] = nombreI.split('_').map(Number);
                const idxI = rI * 3 + cI; // Índice en una lista simple (ej: r=0; c=2 -> 0*3 + 2 = posición 2)

                for (let j = i + 1; j < listaSrc.length; j++) {
                    const partesJ = listaSrc[j].split('/')
                    const nombreJ = partesJ[partesJ.length - 1].replace(".png", "");
                    const [rJ, cJ] = nombreJ.split('_').map(Number);
                    const idxJ = rJ * 3 + cJ;

                    if (idxI > idxJ) inversiones++;
                }
            }
            return inversiones;
        }

        barajar(imagenes) {
            const barajadas = imagenes.slice();
            for (let i = barajadas.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [barajadas[i], barajadas[j]] = [barajadas[j], barajadas[i]];
            }
            if (this.contarInversiones(barajadas) % 2 === 1) {
                [barajadas[0], barajadas[1]] = [barajadas[1], barajadas[0]];
            }
            return barajadas;
        };

        ordenarRompecabezas() {
            const celdas = [];
            // Almacenar los 'td' con el id en orden
            for (let r = 0; r < 3; r++) {
                for (let c = 0; c < 3; c++) {
                    if (!(r === 2 && c === 2)) {
                        celdas.push(document.getElementById(`${r}-${c}`));
                    }
                }
            }
            // Añadir la imagen correspondiente a cada td
            for (let i = 0; i < celdas.length; i++) {
                const src = this.solucionImagenes[i];
                const partes = src.split("/");
                const alt = partes[partes.length - 1].replace(".png", "");
                celdas[i].innerHTML = `<img src="${src}" alt="${alt}">`;
            }
        }

        // Iniciar / reiniciar partida
        reiniciarJuego() {
            if (this.boxVictoria) this.boxVictoria.style.display = "none";
            this.movimientos = 0;
            this.divMovimientos.textContent = this.movimientos;
            this.ordenarRompecabezas();
            const ultimaCelda = document.getElementById("2-2");
            ultimaCelda.innerHTML = '<p class="hueco"></p>';
            this.huecoR = 2;
            this.huecoC = 2;

            const imgs = document.querySelectorAll("td img");
            const desordenar = this.barajar(this.solucionImagenes);
            for (let i = 0; i < imgs.length; i++) {
                imgs[i].src = desordenar[i];
                const partes = desordenar[i].split("/");
                const nombre = partes[partes.length - 1].replace(".png", "");
                imgs[i].alt = nombre;
            }

            this.iniciarContador();
        }

        mostrarImagenCompleta() {
            for (let r = 0; r < 3; r++) {
                for (let c = 0; c < 3; c++) {
                    const td = document.getElementById(`${r}-${c}`);
                    const src = `images/${r}_${c}.png`;
                    td.innerHTML = `<img src="${src}" alt="${r}_${c}">`;
                }
            }
            this.huecoR = 10;
            this.huecoC = 10;

            this.movimientos = 0;
            this.divMovimientos.textContent = this.movimientos;
            this.minutos = 0; this.segundos = 0; this.centesimas = 0;
            this.actualizarTiempo();

            clearInterval(this.control);
            this.btnInicio.textContent = "Iniciar";
            this.iniciado = false;
            this.btnGuardar.disabled = true;
        }

        // Cronómetro
        iniciarContador() {
            this.centesimas = 0; this.segundos = 0; this.minutos = 0;
            this.actualizarTiempo();
            clearInterval(this.control);
            this.control = setInterval(() => this.cronometro(), 10);
        }

        pararContador() {
            clearInterval(this.control);
            this.btnInicio.disabled = false;
        }

        cronometro() {
            this.centesimas++;
            if (this.centesimas === 100) {
                this.centesimas = 0;
                this.segundos++;
            }
            if (this.segundos === 60) {
                this.segundos = 0;
                this.minutos++;
            }
            this.actualizarTiempo();
        }

        actualizarTiempo() {
            const minutos = this.minutos < 10 ? '0' + this.minutos : this.minutos;
            const segundos = this.segundos < 10 ? '0' + this.segundos : this.segundos;
            const centesimas = this.centesimas < 10 ? '0' + this.centesimas : this.centesimas;

            const tiempo = `${minutos}:${segundos}:${centesimas}`;
            this.divTiempo.textContent = tiempo;
        }

        // Comprueba si el puzzle está resuelto
        puzzleResuelto() {
            if (this.huecoR !== 2 || this.huecoC !== 2) return false;

            for (let r = 0; r < 3; r++) {
                for (let c = 0; c < 3; c++) {
                    const td = document.getElementById(`${r}-${c}`);
                    if (!td) return false;
                    const img = td.querySelector("img");

                    if (r === 2 && c === 2) {
                        if (img) return false;
                    }
                    else {
                        if (!img) return false;

                        const alt = img.alt || img.getAttribute("alt") || "";
                        const altCorrecto = `${r}_${c}`;
                        if (alt !== altCorrecto) return false;
                    }
                }
            }

            return true;
        }

        // Actualizar datos de la tabla de puntuaciones
        actualizarTabla() {
            const tbody = this.datosTabla;
            tbody.innerHTML = '';

            if (!this.resultados.length) {
                tbody.innerHTML = `<tr><td colspan="3" class="vacio">No hay resultados</td></tr>`;
                return;
            }

            const resultadosOrdenados = this.resultados.slice().sort((a, b) => a.tiempo - b.tiempo);
            const top10 = resultadosOrdenados.slice(0, 10);
            const ultimo = this.resultados[this.resultados.length - 1];

            for (let i = 0; i < top10.length; i++) {
                const score = top10[i];
                const fila = document.createElement('tr');
                if (score === ultimo) fila.classList.add('ultimo-resultado');
                fila.innerHTML = `
                    <td>${i + 1}</td>
                    <td>${score.tiempoTexto}</td>
                    <td>${score.movimientos}</td>`;
                tbody.appendChild(fila);
            }
        }
    }

    // Crear objeto de rompecabezas
    new Rompecabezas();
});