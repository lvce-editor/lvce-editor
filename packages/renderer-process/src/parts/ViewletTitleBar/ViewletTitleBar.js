import * as AriaRoles from '../AriaRoles/AriaRoles.js'

export const create = () => {
  // TODO set aria label for title bar menu
  // TODO add tests for aria properties
  const $Viewlet = document.createElement('div')
  $Viewlet.id = 'TitleBar'
  $Viewlet.className = 'Viewlet TitleBar'
  $Viewlet.ariaLabel = 'Title Bar'
  // @ts-ignore
  $Viewlet.role = AriaRoles.ContentInfo
  return {
    $TitleBar: $Viewlet,
    $Viewlet,
  }
}
