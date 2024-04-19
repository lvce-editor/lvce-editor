export const getEventListenerOptions = (eventName) => {
  switch (eventName) {
    case 'wheel':
      return {
        passive: true,
      }
    default:
      return undefined
  }
}
