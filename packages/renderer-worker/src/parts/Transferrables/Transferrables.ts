export const transferrables: any[] = []

if (typeof OffscreenCanvas !== 'undefined') {
  transferrables.push(OffscreenCanvas)
}

if (typeof MessagePort !== 'undefined') {
  transferrables.push(MessagePort)
}
