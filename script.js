document.addEventListener("DOMContentLoaded", () => {
    const btnInicio = document.getElementById("btn-inicio");
    const btnGuardar = document.getElementById("btn-guardar");
    const btnCargar = document.getElementById("btn-cargar");
    const tabla = document.querySelector("table");
    const divMovimientos = document.querySelector(".movimientos");
    const divTiempo = document.getElementById("tiempo");
    const eleccion = document.getElementById("eleccion");
    const datosTabla = document.getElementById("datos-tabla");
    let movimientos = 0;
    let control;
    let resultados = [];
    let iniciado = false;

    // Almacenar solución (las 8 imágenes en orden)
    const solucionImagenes = [];
    const imagenes = document.querySelectorAll("td img");
    for (let i = 0; i < imagenes.length - 1; i++) {
        solucionImagenes.push(imagenes[i].src);
    }


    // Posición inicial del hueco (fuera de la tabla para no poder intercambiar al inicio)
    let huecoR = 10;
    let huecoC = 10;

    // Cargar y guardar puntuaciones con localStorage
    function cargarResultados() {
        const guardado = localStorage.getItem("marcadorPuzzle");
        if (guardado) {
            try {
                resultados = JSON.parse(guardado);
            } catch {
                resultados = [];
            }
        }
    }

    function guardarResultados() {
        localStorage.setItem("marcadorPuzzle", JSON.stringify(resultados));
    }


    // Función: verifica si dos celdas son intercambiables
    function intercambiables(r1, c1, r2, c2) {
        if (r1 === r2 && c1 === c2) {
            return false;
        }

        let intercambiable = false;
        if (r1 === r2 && (c1 === c2 + 1 || c1 === c2 - 1)) {
            intercambiable = true;
        } else if (c1 === c2 && (r1 === r2 + 1 || r1 === r2 - 1)) {
            intercambiable = true;
        }

        return intercambiable;
    }

    // Intercambia el contenido de dos casillas
    function intercambiar(r1, c1, r2, c2) {
        const A = document.getElementById(r1 + "-" + c1);
        const B = document.getElementById(r2 + "-" + c2);
        const tmp = A.innerHTML;
        A.innerHTML = B.innerHTML;
        B.innerHTML = tmp;
    };

    // Baraja las imágenes
    function barajar(imagenes) {
        const barajadas = imagenes.slice();
        for (let i = barajadas.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [barajadas[i], barajadas[j]] = [barajadas[j], barajadas[i]];
        }
        return barajadas;
    };

    function ordenarRompecabezas() {
        const celdas = [];
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                if (!(r === 2 && c === 2)) {
                    celdas.push(document.getElementById(`${r}-${c}`));
                }
            }
        }
        for (let i = 0; i < celdas.length; i++) {
            const src = solucionImagenes[i];
            const alt = src.split("/").pop().replace(".png", "");
            celdas[i].innerHTML = `<img src="${src}" alt="${alt}">`;
        }
    }


    function reiniciarJuego() {
        movimientos = 0;
        divMovimientos.textContent = movimientos;
        ordenarRompecabezas();

        const ultimaCelda = document.getElementById("2-2");
        ultimaCelda.innerHTML = '<p class="hueco"></p>';
        huecoR = 2;
        huecoC = 2;

        const imgs = document.querySelectorAll("td img");
        const desordenar = barajar(solucionImagenes);
        for (let i = 0; i < imgs.length; i++) {
            imgs[i].src = desordenar[i];
            const nombre = desordenar[i].split("/").pop().replace(".png", "");
            imgs[i].alt = nombre;
        }

        iniciarContador();
    }


    // Cronómetro
    let centesimas = 0, segundos = 0, minutos = 0;

    function iniciarContador() {
        centesimas = 0; segundos = 0; minutos = 0;
        actualizarTiempo();
        clearInterval(control);
        control = setInterval(cronometro, 10);
    }

    function pararContador() {
        clearInterval(control);
        btnInicio.disabled = false;
    }

    function cronometro() {
        centesimas++;
        if (centesimas === 100) {
            centesimas = 0;
            segundos++;
        }
        if (segundos === 60) {
            segundos = 0;
            minutos++;
        }
        actualizarTiempo();
    }

    function resuelto() {
        if (huecoR !== 2 || huecoC !== 2) return false;

        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                const td = document.getElementById(`${r}-${c}`);
                const img = td.querySelector("img");
                if (r === 2 && c === 2) {
                    if (img) return false;
                } else {
                    if (!img) return false;
                    const nombre = img.getAttribute("alt");
                    const esperado = `${r}_${c}`;
                    if (nombre !== esperado) return false;
                }
            }
        }
        return true;
    }

    function actualizarTiempo() {
        const tiempo =
            `${minutos.toString().padStart(2, '0')}:` +
            `${segundos.toString().padStart(2, '0')}:` +
            `${centesimas.toString().padStart(2, '0')}`;
        divTiempo.textContent = tiempo;
    }

    function getTiempoEnSegundos() {
        return minutos * 60 + segundos + centesimas / 100;
    }

    function guardarPuntuacion() {
        const tiempoTotal = getTiempoEnSegundos();
        const tiempoTexto = divTiempo.textContent;

        resultados.push({
            tiempo: tiempoTotal,
            tiempoTexto: tiempoTexto,
            movimientos: movimientos
        });

        guardarResultados();
        actualizarTabla();
    }

    function actualizarTabla() {
        const filtro = eleccion.value;
        const resultadosOrdenados = resultados.slice();

        resultadosOrdenados.sort(function (a, b) {
            if (filtro === 'tiempo') {
                return a.tiempo - b.tiempo;
            } else {
                return a.movimientos - b.movimientos;
            }
        });

        datosTabla.innerHTML = '';

        for (let i = 0; i < resultadosOrdenados.length; i++) {
            const score = resultadosOrdenados[i];
            const row = document.createElement('tr');
            row.innerHTML =
                '<td>' + (i + 1) + '</td>' +
                '<td>' + score.tiempoTexto + '</td>' +
                '<td>' + score.movimientos + '</td>';
            datosTabla.appendChild(row);
        }
    }

    eleccion.addEventListener('change', actualizarTabla);

    btnInicio.addEventListener("click", () => {
        if (!iniciado) {
            iniciado = true;
            btnInicio.textContent = "Reiniciar";
        }
        reiniciarJuego();
    });

    btnGuardar.addEventListener("click", () => {
        // Guardar tiempo, movimientos, y posición actual de cada imagen.
        localStorage.setItem("partidaGuardada", JSON.stringify());
    });

    tabla.addEventListener("mousedown", (e) => {
        const td = e.target.closest("td");
        if (!td) return;

        const partes = td.id.split("-");
        let r = Number(partes[0]);
        let c = Number(partes[1]);
        if (intercambiables(r, c, huecoR, huecoC)) {
            intercambiar(r, c, huecoR, huecoC);
            movimientos++;
            divMovimientos.textContent = movimientos;
            huecoR = r;
            huecoC = c;
        }

        // Comprobar si ha ganado
        if (resuelto()) {
            pararContador();

            // Colocar la última pieza para mostrar la imagen completa.
            const ultimaCelda = document.getElementById("2-2");
            const img = document.createElement("img");
            img.src = "images/dog/2_2.png";
            img.alt = "2_2";
            ultimaCelda.innerHTML = "";
            ultimaCelda.appendChild(img);

            btnInicio.textContent = "Iniciar";

            // Guardar puntuación
            guardarPuntuacion();

            // Librería de JavaScript para simular confetis al ganar
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 }
            });
        }
    });

    cargarResultados();
    actualizarTabla();
});