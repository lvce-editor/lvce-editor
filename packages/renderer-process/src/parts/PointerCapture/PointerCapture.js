// workaround for not being setPointerCapture() not working on
// synthetic events
export const mock = () => {
  globalThis._originalSetPointerCapture = Element.prototype.setPointerCapture
  globalThis._originalReleasePointerCapture = Element.prototype.releasePointerCapture

  Element.prototype.setPointerCapture = () => {}
  Element.prototype.releasePointerCapture = () => {}
}

export const unmock = () => {
  Element.prototype.setPointerCapture = globalThis._originalSetPointerCapture
  Element.prototype.releasePointerCapture = globalThis._originalReleasePointerCapture
}
