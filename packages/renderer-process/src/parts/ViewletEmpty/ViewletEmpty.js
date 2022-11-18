export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.dataset.viewlet = 'Empty'
  $Viewlet.className = 'Viewlet'
  return {
    $Viewlet,
  }
}

export const refresh = (state, context) => {}

export const focus = (state) => {}

export const dispose = (state) => {}
