export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet MarkDownPreview'
  return {
    $Viewlet,
  }
}

export const setDom = (state, dom) => {}
