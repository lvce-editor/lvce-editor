export const supportsHtml5Dialog = () => {
  const $Dialog = document.createElement('dialog')
  // @ts-ignore
  return typeof $Dialog.showModal === 'function'
}
