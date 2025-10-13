document.addEventListener("DOMContentLoaded", () => {
    const btnInicio = document.getElementById("btn-inicio");
    const tabla = document.querySelector("table");
    const divMovimientos = document.querySelector(".movimientos");
    let movimientos = 0;

    // Solución (las 8 imágenes en orden)
    const solucionImagenes = [];
    const imagenes = Array.from(document.querySelectorAll("td img"));
    for (let i = 0; i < imagenes.length; i++) {
        solucionImagenes.push(imagenes[i].src);
    }

    // Posición del hueco
    const hueco = document.querySelector(".hueco").closest("td");
    const partes = hueco.id.split("-");
    let huecoR = Number(partes[0]);
    let huecoC = Number(partes[1]);

    function getCasilla(r, c) {
        return document.getElementById(r + "-" + c);
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
    const intercambiar = (r1, c1, r2, c2) => {
        const A = getCasilla(r1, c1);
        const B = getCasilla(r2, c2);
        const tmp = A.innerHTML;
        A.innerHTML = B.innerHTML;
        B.innerHTML = tmp;
    };

    // Baraja las imágenes
    const barajar = (imagenes) => {
        const barajadas = imagenes.slice();
        for (let i = barajadas.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [barajadas[i], barajadas[j]] = [barajadas[j], barajadas[i]];
        }
        return barajadas;
    };


    // Botón inicio
    btnInicio.addEventListener("click", () => {
        movimientos = 0;
        divMovimientos.textContent = "Movimientos: " + movimientos;
        const imgs = Array.from(document.querySelectorAll("td img"));
        const des = barajar(solucionImagenes);
        imgs.forEach((img, i) => (img.src = des[i]));
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
    });
});
