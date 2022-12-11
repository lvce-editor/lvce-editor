export const mouseEvent = (element, eventType, options) => {
  const event = new MouseEvent(eventType, options)
  element.dispatchEvent(event)
}

export const mouseDown = (element, options) => {
  mouseEvent(element, 'mousedown', options)
}

export const mouseUp = (element, options) => {
  mouseEvent(element, 'mouseup', options)
}

export const contextMenu = (element, options) => {
  mouseEvent(element, 'contextmenu', options)
}

export const click = (element, options) => {
  mouseDown(element, options)
  mouseEvent(element, 'click', options)
  mouseUp(element, options)
  if (options.button === 2 /* right */) {
    contextMenu(element, options)
  }
}

export const hover = (element, options) => {
  mouseEvent(element, 'mouseenter', options)
}

export const type = (element, options) => {
  element.value = options.text
}

export const keyboardEvent = (element, eventType, options) => {
  const event = new KeyboardEvent(eventType, options)
  element.dispatchEvent(event)
}

export const keyDown = (element, options) => {
  keyboardEvent(element, 'keydown', options)
}

export const keyUp = (element, options) => {
  keyboardEvent(element, 'keyup', options)
}

const getEventClass = (eventType) => {
  switch (eventType) {
    case 'wheel':
      return WheelEvent
    case 'pointerdown':
    case 'pointerup':
    case 'pointermove':
      return PointerEvent
    default:
      return Event
  }
}

export const dispatchEvent = (element, options) => {
  const eventClass = getEventClass(options.type)
  const event = new eventClass(options.type, options.init)
  element.dispatchEvent(event)
}
