export const getEventListenerOptions = (eventName: string) => {
  switch (eventName) {
    case 'wheel':
      return {
        passive: true,
      }
    default:
      return undefined
  }
}
