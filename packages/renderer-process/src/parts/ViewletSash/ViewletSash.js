import * as ViewletSashEvents from './ViewletSashEvents.js'

export const create = () => {
  // TODO use aria role splitter once supported https://github.com/w3c/aria/issues/1348
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Sash SashVertical'
  $Viewlet.id = 'SashSideBar'
  $Viewlet.onpointerdown = ViewletSashEvents.handleSashPointerDown
  return {
    $Viewlet,
  }
}
