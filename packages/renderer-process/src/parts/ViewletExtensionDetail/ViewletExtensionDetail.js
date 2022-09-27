export const name = 'ExtensionDetail'

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet'
  $Viewlet.dataset.viewletId = 'ExtensionDetail'
  $Viewlet.textContent = 'ExtensionDetail'
  return {
    $Viewlet,
  }
}
