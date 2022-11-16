export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet DiffEditor'

  return {
    $Viewlet,
  }
}
