export const create = () => {
  // TODO set aria label for title bar menu
  // TODO add tests for aria properties
  const $Viewlet = document.createElement('div')
  $Viewlet.id = 'TitleBar'
  $Viewlet.className = 'Viewlet TitleBar'
  $Viewlet.ariaLabel = 'Title Bar'
  // @ts-ignore
  $Viewlet.role = 'contentinfo'
  return {
    $TitleBar: $Viewlet,
    $Viewlet,
  }
}
