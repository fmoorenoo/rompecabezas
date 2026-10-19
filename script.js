document.addEventListener("DOMContentLoaded", () => {
    const btnInicio = document.getElementById("btn-inicio");
    const tabla = document.querySelector("table");
    const divMovimientos = document.querySelector(".movimientos");
    const divTiempo = document.getElementById("tiempo");
    let movimientos = 0;
    let control; // para el cronómetro

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

    // Genera una partida resoluble mediante movimientos válidos desde el tablero ordenado.
    function barajar(imagenes) {
        const casillas = [...imagenes, null];
        let hueco = 8;
        let posicionAnterior = -1;

        for (let paso = 0; paso < 100; paso++) {
            const fila = Math.floor(hueco / 3);
            const columna = hueco % 3;
            const vecinos = [];
            if (fila > 0) vecinos.push(hueco - 3);
            if (fila < 2) vecinos.push(hueco + 3);
            if (columna > 0) vecinos.push(hueco - 1);
            if (columna < 2) vecinos.push(hueco + 1);

            // Evita deshacer inmediatamente el movimiento anterior.
            const candidatos = vecinos.filter(posicion => posicion !== posicionAnterior);
            const siguiente = candidatos[Math.floor(Math.random() * candidatos.length)];
            [casillas[hueco], casillas[siguiente]] = [casillas[siguiente], casillas[hueco]];
            posicionAnterior = hueco;
            hueco = siguiente;
        }

        return casillas;
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

    function actualizarTiempo() {
        const formato =
            `${minutos.toString().padStart(2, '0')}:` +
            `${segundos.toString().padStart(2, '0')}:` +
            `${centesimas.toString().padStart(2, '0')}`;
        divTiempo.textContent = "Tiempo: " + formato;
    }

    // Botón inicio
    btnInicio.addEventListener("click", () => {
        movimientos = 0;
        divMovimientos.textContent = "Movimientos: " + movimientos;
        const desordenar = barajar(solucionImagenes);
        desordenar.forEach((imagen, posicion) => {
            const celda = document.getElementById(Math.floor(posicion / 3) + "-" + (posicion % 3));
            celda.innerHTML = imagen ? '<img src="' + imagen + '" alt="Pieza del rompecabezas">' : '<p class="hueco"></p>';
        });
        const indiceHueco = desordenar.indexOf(null);
        huecoR = Math.floor(indiceHueco / 3);
        huecoC = indiceHueco % 3;

        iniciarContador();
    });

    // Click en la tabla
    tabla.addEventListener("mousedown", (e) => {
        const td = e.target.closest("td");
        const partes = td.id.split("-");
        let r = Number(partes[0]);
        let c = Number(partes[1]);
        if (intercambiables(r, c, huecoR, huecoC)) {
            intercambiar(r, c, huecoR, huecoC);
            movimientos++;
            divMovimientos.textContent = "Movimientos: " + movimientos;
            huecoR = r; huecoC = c;
        }
        // La victoria exige que las ocho piezas estén en su sitio y el hueco al final.
        const resuelto = huecoR === 2 && huecoC === 2 &&
            solucionImagenes.every((imagen, indice) => {
                const celda = document.getElementById(Math.floor(indice / 3) + "-" + (indice % 3));
                const pieza = celda.querySelector("img");
                return pieza !== null && pieza.src === imagen;
            });

        if (resuelto) {
            pararContador();
            const ultimaCelda = document.getElementById("2-2");
            ultimaCelda.innerHTML = '<img src="images/dog/2_2.png" alt="2-2">';
            huecoR = 10;
            huecoC = 10;
        }
    });
});
