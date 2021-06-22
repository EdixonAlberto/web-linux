export default function draggable(
  el,
  elSelectable,
  elNoSelectable,
  offsetPosition = { left: 0, top: 0 }
) {
  const elDowm = elSelectable ? elSelectable : el

  /*
    Se desactiva el soporte de arrastre nativo del navegador
    para que no entre en conflicto con el arrastre personalizado.
  */
  el.ondragstart = () => false

  // Se manipula el evento de arrastre al hacer click en el elemento seleccionable
  elDowm.onmousedown = event => {
    const isMouseOnHeader = elNoSelectable
      ? event.layerX > elDowm.clientWidth - elNoSelectable.clientWidth
      : null
    const shiftX = event.clientX - el.getBoundingClientRect().left
    const shiftY = event.clientY - el.getBoundingClientRect().top
    const main = document.querySelector('main')

    // Se descarta la zona no seleccionable
    if (isMouseOnHeader) return true

    // Mover elemento posicionado absolutamente bajo el puntero
    const onMouseMove = event => {
      /*
        Se verifica el estado actual del boton cuando
        el mouse sale del contenedor y regresa sobre la ventana
      */
      if (event.buttons) {
        el.style.transition = 'none'

        // Centrar el elemento en las coordenadas (pageX, pageY)
        const pageX = event.pageX
        const pageY = event.pageY
        const elWidth = pageX - shiftX + el.clientWidth
        const elHeight = pageY - shiftY + el.clientHeight - offsetPosition.top

        const positionAbsolute = {
          left: pageX - shiftX - offsetPosition.left,
          top: pageY - shiftY - offsetPosition.top
        }

        if (positionAbsolute.left > 0 && elWidth < main.clientWidth) {
          el.style.left = positionAbsolute.left + 'px'
        }

        if (positionAbsolute.top > 0 && elHeight < main.clientHeight) {
          el.style.top =
            positionAbsolute.top + (elSelectable ? elSelectable.clientHeight : 0) + 'px'
        }

        return false
      } else {
        destroyOnMouseMove()
        return true
      }
    }

    const destroyOnMouseMove = () => {
      document.removeEventListener('mousemove', onMouseMove)
      el.onmouseup = null
    }

    // Mover el elemento con mousemove
    document.addEventListener('mousemove', onMouseMove)

    // Al soltar el elemento se remueve el manejador de eventos
    el.onmouseup = () => destroyOnMouseMove
  }
}
