document.addEventListener("DOMContentLoaded", () => {
    const btnInicio = document.getElementById("btn-inicio");
    const tabla = document.querySelector("table");
    const divMovimientos = document.querySelector(".movimientos");
    const divTiempo = document.getElementById("tiempo");
    const sortSelect = document.getElementById("sort-select");
    const scoresBody = document.getElementById("scores-body");
    let movimientos = 0;
    let control;
    let scores = [];

    // Almacenar solución (las 8 imágenes en orden)
    const solucionImagenes = [];
    const imagenes = document.querySelectorAll("td img");
    for (let i = 0; i < imagenes.length - 1; i++) {
        solucionImagenes.push(imagenes[i].src);
    }


    // Posición inicial del hueco (fuera de la tabla para no poder intercambiar al inicio)
    let huecoR = 10;
    let huecoC = 10;


    // Función: verifica si dos celdas son intercambiables
    // Comprueba si dos casillas son intercambiables (si está al lado el hueco)
    function intercambiables(r1, c1, r2, c2) {
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

    // Variables del cronómetro
    let centesimas = 0, segundos = 0, minutos = 0;

    function iniciarContador() {
        centesimas = 0; segundos = 0; minutos = 0;
        actualizarTiempo();
        clearInterval(control);
        control = setInterval(cronometro, 10);
        btnInicio.disabled = true;
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

    function esResuelto() {
        if (huecoR !== 2 || huecoC !== 2) return false;

        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                const td = document.getElementById(`${r}-${c}`);
                const img = td.querySelector("img");
                if (r === 2 && c === 2) {
                    if (img) return false; 
                } else {
                    if (!img || img.alt !== `${r}_${c}`) return false;
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

    function agregarPuntuacion() {
        const tiempoTotal = getTiempoEnSegundos();
        const tiempoTexto = divTiempo.textContent;

        scores.push({
            tiempo: tiempoTotal,
            tiempoTexto: tiempoTexto,
            movimientos: movimientos
        });

        actualizarTabla();
    }

    function actualizarTabla() {
        const criterio = sortSelect.value;

        const scoresOrdenados = [...scores].sort((a, b) => {
            if (criterio === 'tiempo') {
                return a.tiempo - b.tiempo;
            } else {
                return a.movimientos - b.movimientos;
            }
        });

        scoresBody.innerHTML = '';

        if (scoresOrdenados.length === 0) {
            scoresBody.innerHTML = '<tr><td colspan="3" class="no-scores">¡Completa el puzzle para aparecer aquí!</td></tr>';
            return;
        }

        scoresOrdenados.forEach((score, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                        <td class="rank-cell">${index + 1}</td>
                        <td>${score.tiempoTexto}</td>
                        <td>${score.movimientos}</td>
                    `;
            scoresBody.appendChild(row);
        });
    }

    sortSelect.addEventListener('change', actualizarTabla);

    btnInicio.addEventListener("click", () => {
        movimientos = 0;
        divMovimientos.textContent = movimientos;
        const imgs = document.querySelectorAll("td img");
        const desordenar = barajar(solucionImagenes);

        for (let i = 0; i < desordenar.length; i++) {
            imgs[i].src = desordenar[i];
        }

        // Sustituir la última imagen por el hueco
        const ultimaCelda = document.getElementById("2-2");
        ultimaCelda.innerHTML = '<p class="hueco"></p>';
        huecoR = 2;
        huecoC = 2;

        iniciarContador();
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
            huecoR = r; huecoC = c;
        }

        // Comprobar si ha ganado
        if (esResuelto()) {
            pararContador();

            // Colocar la última pieza para mostrar la imagen completa.
            const celda = document.getElementById("2-2");
            celda.innerHTML = "<img src='images/dog/2_2.png' alt='2-2'>";

            // Deshabilitar el hueco
            huecoR = 10; huecoC = 10;

            // Guardar puntuación
            agregarPuntuacion();
        }
    });
});