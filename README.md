<div align="center">

# Rompecabezas

### Juego de lógica deslizante de 3 × 3 desarrollado con JavaScript

**Frontend · Juego interactivo · HTML, CSS y JavaScript**

![HTML5](https://img.shields.io/badge/HTML5-1A1B26?style=for-the-badge&logo=html5&logoColor=E46B79)
![CSS3](https://img.shields.io/badge/CSS3-1A1B26?style=for-the-badge&logo=css3&logoColor=E46B79)
![JavaScript](https://img.shields.io/badge/JavaScript-1A1B26?style=for-the-badge&logo=javascript&logoColor=E46B79)
![DOM](https://img.shields.io/badge/DOM-1A1B26?style=for-the-badge&logo=javascript&logoColor=E46B79)

[![Estado](https://img.shields.io/badge/ESTADO-Proyecto_de_práctica-712B39?style=flat-square)](#estado-del-proyecto)
[![Tipo](https://img.shields.io/badge/TIPO-Juego_web-22252C?style=flat-square)](#sobre-el-proyecto)
[![Código](https://img.shields.io/badge/REPOSITORIO-Código_fuente-22252C?style=flat-square)](https://github.com/fmoorenoo/rompecabezas)

</div>

---

## Sobre el proyecto

**Rompecabezas** es un juego de lógica para navegador basado en un tablero de **3 × 3 casillas**, formado por ocho piezas de imagen y un espacio vacío. El objetivo es desplazar las piezas adyacentes al hueco para reconstruir la imagen original.

El juego está desarrollado con **HTML5, CSS3 y JavaScript puro**, sin frameworks ni backend. Incluye mezcla inicial de piezas, contador de movimientos y cronómetro.

## Funcionalidades

- **Tablero de 3 × 3:** ocho fragmentos de imagen y una casilla vacía.
- **Inicio de partida:** el botón *INICIAR* mezcla las piezas y comienza a contar el tiempo.
- **Movimiento por adyacencia:** solo se intercambian las piezas situadas junto al espacio vacío.
- **Contador de movimientos:** registra los desplazamientos realizados.
- **Cronómetro:** muestra minutos, segundos y centésimas.
- **Comprobación de resultado:** lógica para detectar la disposición de las piezas y detener el cronómetro.

> Las funcionalidades proceden del código fuente. No se ha ejecutado una prueba completa de jugabilidad durante esta revisión.

## Tecnologías

| Área | Tecnologías |
| --- | --- |
| **Estructura** | HTML5 |
| **Estilos** | CSS3 |
| **Lógica** | JavaScript (vanilla) |
| **Interactividad** | DOM · eventos de ratón |
| **Temporización** | `setInterval` · `clearInterval` |
| **Recursos** | Fragmentos de imagen locales |
| **Servidor** | No requiere backend |

## Arquitectura

```text
rompecabezas/
├── index.html               # Tablero, botón y contadores
├── styles.css               # Presentación del tablero
├── script.js                # Mezcla, movimientos, tiempo y validación
└── images/
    └── dog/                 # Piezas de la imagen del rompecabezas
```

La interfaz define las nueve celdas en `index.html`. El archivo `script.js` gestiona el estado de la partida, comprueba qué piezas son adyacentes al hueco y actualiza los contadores y el contenido de las celdas.

## Cómo jugar

1. Pulsa **INICIAR** para mezclar las piezas.
2. Selecciona una pieza contigua al espacio vacío para desplazarla.
3. Reordena los fragmentos hasta formar la imagen.
4. Consulta el número de movimientos y el tiempo transcurrido.

La imagen original está dividida en ocho piezas móviles y la posición final corresponde a la casilla inferior derecha.

## Vista del proyecto

<div align="center">
  <img src="images/dog/0_0.png" alt="Fragmento de la imagen utilizada en el rompecabezas" width="130">
  <img src="images/dog/0_1.png" alt="Segundo fragmento de la imagen utilizada en el juego" width="130">
  <img src="images/dog/0_2.png" alt="Tercer fragmento de la imagen utilizada en el juego" width="130">
  <p><sub>Fragmentos gráficos del juego; no son una captura del tablero completo.</sub></p>
</div>

No se ha encontrado una captura de pantalla completa en el repositorio. Se puede incorporar más adelante para mostrar el diseño real de la interfaz.

## Instalación y ejecución

1. Clona el repositorio:

   ```bash
   git clone https://github.com/fmoorenoo/rompecabezas.git
   cd rompecabezas
   ```

2. Abre `index.html` en un navegador moderno.

Opcionalmente, puedes iniciar un servidor local:

```bash
python -m http.server 8000
```

Después visita `http://localhost:8000/`.

No es necesario instalar dependencias mediante npm.

## Estado del proyecto

**Proyecto de práctica frontend.** El código implementa las reglas básicas de desplazamiento, la cuenta de movimientos y el cronómetro.

### Limitaciones detectadas durante la revisión estática

- **Partidas potencialmente irresolubles:** el algoritmo de mezcla utiliza un barajado aleatorio de las ocho piezas sin comprobar la paridad de la permutación. Algunas configuraciones iniciales pueden no tener solución mediante movimientos válidos.
- **Validación de victoria:** el código compara las imágenes presentes en el DOM sin validar explícitamente la posición del hueco; conviene revisar la lógica para detectar correctamente una partida completada.
- **Interacción:** la entrada se gestiona mediante `mousedown`; el soporte táctil y la accesibilidad por teclado requieren revisión.

Estas observaciones se documentan sin modificar el comportamiento original del juego.

## Autor

**Fernando Montelongo Moreno** · Full Stack Developer · DAM + DAW

[![GitHub](https://img.shields.io/badge/GitHub-fmoorenoo-22252C?style=flat-square&logo=github)](https://github.com/fmoorenoo)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Perfil_profesional-712B39?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/fernando-montelongo/)

---

<div align="center">
  <sub>Rompecabezas · Juego de lógica para navegador desarrollado con JavaScript</sub>
</div>
