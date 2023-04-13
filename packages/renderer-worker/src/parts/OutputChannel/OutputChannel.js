export const connect = () => {
  const target = new EventTarget()
  setInterval(() => {
    const event = new Event('data', {
      value: '',
    })
    target.dispatchEvent(event)
  }, 1000)
  return {
    on(event, listener) {
      target.addEventListener(event, listener)
    },
    off(event, listener) {
      target.removeEventListener(event, listener)
    },
  }
}
