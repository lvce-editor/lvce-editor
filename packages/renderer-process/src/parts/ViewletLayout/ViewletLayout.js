export const name = 'Layout'

export const create = () => {
  // TODO create sashes

  const $Viewlet = document.createElement('div')
  $Viewlet.dataset.viewletId = 'Layout'

  return {
    $Viewlet,
  }
}
