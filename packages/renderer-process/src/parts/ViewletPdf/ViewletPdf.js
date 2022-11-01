export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet Pdf'
  $Viewlet.textContent = 'pdf'
  return {
    $Viewlet,
  }
}
