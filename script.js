document.addEventListener("DOMContentLoaded", () => {
    const btnInicio = document.getElementById("btn-inicio");
    const tabla = document.querySelector("table");
    const divMovimientos = document.querySelector(".movimientos");
    let movimientos = 0;

    // Almacenar solución (las 8 imágenes en orden)
    const solucionImagenes = [];
    const imagenes = document.querySelectorAll("td img");
    for (let i = 0; i < imagenes.length; i++) {
        solucionImagenes.push(imagenes[i].src);
    }

    // Posición del hueco
    const hueco = document.querySelector(".hueco").closest("td");
    const partes = hueco.id.split("-");
    let huecoR = Number(partes[0]);
    let huecoC = Number(partes[1]);

    function getCasilla(r, c) {
        return
    }

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

    var centesimas = 0;
    var segundos = 0;
    var minutos = 0;

    function iniciarContador() {
        control = setInterval(cronometro, 10);
        document.getElementById("inicio").disabled = true;
        document.getElementById("reinicio").disabled = false;
    }
    function pararContador() {
        clearInterval(control);
        document.getElementById("parar").disabled = true;
    }

    function reiniciarContador() {
        clearInterval(control);
        centesimas = 0;
        segundos = 0;
        minutos = 0;
        horas = 0;
        Centesimas.innerHTML = ":00";
        Segundos.innerHTML = ":00";
        Minutos.innerHTML = ":00";
        Horas.innerHTML = "00";
        document.getElementById("inicio").disabled = false;
        document.getElementById("parar").disabled = true;
        document.getElementById("reinicio").disabled = true;
    }

    function cronometro() {
        if (centesimas < 99) {
            centesimas++;
            if (centesimas < 10) { centesimas = "0" + centesimas }
            Centesimas.innerHTML = ":" + centesimas;
        }
        if (centesimas == 99) {
            centesimas = -1;
        }
        if (centesimas == 0) {
            segundos++;
            if (segundos < 10) { segundos = "0" + segundos }
            Segundos.innerHTML = ":" + segundos;
        }
        if (segundos == 59) {
            segundos = -1;
        }
        if ((centesimas == 0) && (segundos == 0)) {
            minutos++;
            if (minutos < 10) { minutos = "0" + minutos }
            Minutos.innerHTML = ":" + minutos;
        }
        if (minutos == 59) {
            minutos = -1;
        }
    }


    // Botón inicio
    btnInicio.addEventListener("click", () => {
        movimientos = 0;
        iniciarContador();
        divMovimientos.textContent = "Movimientos: " + movimientos;
        const imgs = document.querySelectorAll("td img");
        const desordenar = barajar(solucionImagenes);
        imgs.forEach((img, i) => (img.src = desordenar[i]));
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
        // Comprobar si ha ganado
        let resuelto = false;
        const imgs = document.querySelectorAll("td img");
        for (let i = 0; i < imgs.length; i++) {
            if (imgs[i].src !== solucionImagenes[i]) {
                resuelto = false;
                break;
            } else {
                resuelto = true;
            }
        }
        if (resuelto) {
            console.log("¡Has ganado!");
        }
    });
});
