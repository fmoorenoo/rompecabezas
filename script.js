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
    btnGuardar.disabled = true;

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

    function actualizarBotonCargar() {
        const raw = localStorage.getItem("partidaGuardada");
        if (!raw) {
            btnCargar.disabled = true;
            return;
        }

        let estado;
        try {
            estado = JSON.parse(raw);
        } catch {
            btnCargar.disabled = true;
            return;
        }

        btnCargar.disabled = false;
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

    function mostrarImagenCompleta() {
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                const td = document.getElementById(`${r}-${c}`);
                const src = `images/dog/${r}_${c}.png`;
                td.innerHTML = `<img src="${src}" alt="${r}_${c}">`;
            }
        }
        huecoR = 10;
        huecoC = 10;

        movimientos = 0;
        divMovimientos.textContent = movimientos;
        minutos = 0; segundos = 0; centesimas = 0;
        actualizarTiempo();

        clearInterval(control);
        btnInicio.textContent = "Iniciar";
        iniciado = false;
        btnGuardar.disabled = true;
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
        btnGuardar.disabled = false;
        reiniciarJuego();
    });

    btnGuardar.addEventListener("click", () => {
        clearInterval(control);

        const celdas = [];
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                const td = document.getElementById(`${r}-${c}`);
                const img = td.querySelector("img");
                if (img) {
                    celdas.push({
                        r, c,
                        src: img.getAttribute("src"),
                        alt: img.getAttribute("alt")
                    });
                } else {
                    celdas.push({ r, c, empty: true });
                }
            }
        }

        const estado = {
            movimientos: movimientos,
            tiempo: { minutos, segundos, centesimas },
            hueco: { r: huecoR, c: huecoC },
            celdas: celdas
        };
        localStorage.setItem("partidaGuardada", JSON.stringify(estado));
        console.log("Partida guardada", estado);

        mostrarImagenCompleta();
        actualizarBotonCargar();
    });


    btnCargar.addEventListener("click", () => {
        const raw = localStorage.getItem("partidaGuardada");
        if (!raw) {
            console.warn("No hay partida guardada para cargar.");
            return;
        }

        let estadoObj;
        try {
            estadoObj = JSON.parse(raw);
        } catch (e) {
            console.error("Partida corrupta en localStorage.", e);
            return;
        }

        const celdas = estadoObj.celdas || [];
        for (const celda of celdas) {
            const td = document.getElementById(`${celda.r}-${celda.c}`);
            if (celda.empty) {
                td.innerHTML = '<p class="hueco"></p>';
            } else {
                const src = celda.src || (celda.alt ? `images/dog/${celda.alt}.png` : "");
                const alt = celda.alt || (src ? src.split("/").pop().replace(".png", "") : "");
                td.innerHTML = `<img src="${src}" alt="${alt}">`;
            }
        }

        // Hueco
        if (estadoObj.hueco) {
            huecoR = Number(estadoObj.hueco.r);
            huecoC = Number(estadoObj.hueco.c);
        } else {
            huecoR = 2; huecoC = 2;
        }

        // Movimientos
        movimientos = Number(estadoObj.movimientos || 0);
        divMovimientos.textContent = movimientos;

        // Tiempo 
        if (estadoObj.tiempo) {
            minutos = Number(estadoObj.tiempo.minutos || 0);
            segundos = Number(estadoObj.tiempo.segundos || 0);
            centesimas = Number(estadoObj.tiempo.centesimas || 0);
        } else {
            minutos = segundos = centesimas = 0;
        }

        actualizarTiempo();

        clearInterval(control);
        control = setInterval(cronometro, 10);

        if (!iniciado) iniciado = true;
        btnInicio.textContent = "Reiniciar";
        btnGuardar.disabled = false;
        actualizarBotonCargar();
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

            huecoR = 10;
            huecoC = 10;

            // Guardar puntuación
            guardarPuntuacion();

            // Borrar partida guardada
            localStorage.removeItem("partidaGuardada");
            actualizarBotonCargar();
            btnGuardar.disabled = true;

            // Librería de JavaScript para simular confetis al ganar
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 }
            });
        }
    });

    actualizarBotonCargar();
    cargarResultados();
    actualizarTabla();
});