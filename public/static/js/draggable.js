export default function draggable(appWindow) {
  const appHeader = appWindow.children[0]

  // Se desactiva el soporte de arrastre nativo del navegador,
  // y de esta manera no entre en conflicto con el manipulado.
  appWindow.ondragstart = () => false

  // Se manipula el evento de arrastre al seleccionar el header de la ventana
  appHeader.onmousedown = event => {
    const buttons = appHeader.children[2]
    const heightHeader = 30
    const shiftX = event.clientX - appWindow.getBoundingClientRect().left
    const shiftY = event.clientY - appWindow.getBoundingClientRect().top
    const main = document.querySelector('main')
    const isMouseOnHeader = event.layerX > appHeader.clientWidth - buttons.clientWidth

    // Se descarta la zona de los botones en el header
    if (isMouseOnHeader) return true

    // Quitar cualquier padre actual y posicionarlo relativo al main
    main.append(appWindow)

    // Mover nuestra ventana posicionada absolutamente bajo el puntero
    const onMouseMove = event => {
      /*
        Se verifica el estado actual del boton cuando
        el mouse sale del contenedor
        y regresa sobre la ventana
      */
      if (event.buttons) {
        appWindow.style.transition = 'none'

        // Centrar la ventana en las coordenadas (pageX, pageY)
        const pageX = event.pageX
        const pageY = event.pageY
        const windowWidth = pageX - shiftX + appWindow.clientWidth
        const windowHeight = pageY - shiftY + appWindow.clientHeight - heightHeader

        if (pageX - shiftX > 0 && windowWidth < main.clientWidth) {
          appWindow.style.left = pageX - shiftX + 'px'
        }

        if (pageY > heightHeader + shiftY && windowHeight < main.clientHeight) {
          appWindow.style.top = pageY - shiftY + 'px'
        }

        return false
      } else {
        destroyOnMouseMove()
        return true
      }
    }

    const destroyOnMouseMove = () => {
      document.removeEventListener('mousemove', onMouseMove)
      appWindow.onmouseup = null
    }

    // Mover la ventana con mousemove
    document.addEventListener('mousemove', onMouseMove)

    // Al soltar la ventana quitar cualquier manejador de eventos innecesario
    appWindow.onmouseup = () => destroyOnMouseMove
  }
}
