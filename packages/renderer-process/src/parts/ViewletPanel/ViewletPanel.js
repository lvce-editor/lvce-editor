import * as Assert from '../Assert/Assert.js'

export const create = () => {
  // const $PanelContent = document.createElement('div')
  // $PanelContent.id = 'PanelContent'
  const $Viewlet = document.createElement('div')
  $Viewlet.id = 'Panel'
  $Viewlet.className = 'Viewlet Panel'
  $Viewlet.ariaLabel = 'Panel'
  return {
    $Panel: $Viewlet,
    $Viewlet,
    $PanelContent: undefined,
  }
}

export const appendViewlet = (state, name, $Viewlet) => {
  Assert.object(state)
  Assert.string(name)
  Assert.object($Viewlet)
  // TODO is it a problem that the id is duplicated for a short amount of time here?
  $Viewlet.id = 'PanelContent'
  if (state.$PanelContent) {
    state.$PanelContent.replaceWith($Viewlet)
  } else {
    state.$Panel.append($Viewlet)
  }
  state.$PanelContent = $Viewlet
}

// TODO add test for focus method
export const focus = (state) => {
  Assert.object(state)
  if (!state.currentViewlet) {
    return
  }
  state.currentViewlet.factory.focus(state.currentViewlet.state)
}

export const dispose = (state) => {
  if (state.$PanelContent) {
    state.$PanelContent.remove()
    state.$PanelContent = undefined
  }
  if (state.$PanelHeader) {
    state.$PanelHeader.remove()
    state.$PanelHeader = undefined
  }
}
