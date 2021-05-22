export default function draggable(window) {
  const ball = window.body

  /*
    Esto es porque el navegador tiene su propio soporte para arrastrar y soltar para imágenes
    y otros elementos. Se ejecuta automáticamente y entra en conflicto con el nuestro.
  */
  ball.ondragstart = () => false

  window.header.onmousedown = event => {
    // (1) preparar para mover: hacerlo absoluto y ponerlo sobre todo con el z-index
    // ball.style.position = 'absolute'
    // ball.style.zIndex = 1000

    // quitar cualquier padre actual y moverlo directamente a body
    // para posicionarlo relativo al body
    document.querySelector('main').append(ball)

    // centrar la pelota en las coordenadas (pageX, pageY)

    let shiftX = event.clientX - ball.getBoundingClientRect().left
    let shiftY = event.clientY - ball.getBoundingClientRect().top

    const moveAt = (pageX, pageY) => {
      ball.style.left = pageX - shiftX + 'px'
      ball.style.top = pageY - shiftY + 'px'
    }

    // mover nuestra pelota posicionada absolutamente bajo el puntero
    // moveAt(event.pageX, event.pageY)

    const onMouseMove = event => {
      moveAt(event.pageX, event.pageY)
    }

    // (2) mover la pelota con mousemove
    document.addEventListener('mousemove', onMouseMove)

    // (3) soltar la pelota, quitar cualquier manejador de eventos innecesario
    ball.onmouseup = () => {
      document.removeEventListener('mousemove', onMouseMove)
      ball.onmouseup = null
    }
  }
}
