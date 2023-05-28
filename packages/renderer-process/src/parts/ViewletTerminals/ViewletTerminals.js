import * as VirtualDom from '../VirtualDom/VirtualDom.js'
import * as ViewletTerminalsEvents from './ViewletTerminalsEvents.js'

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet Terminals'
  return {
    $Viewlet,
    $TerminalTabs: undefined,
  }
}

export const setTabsDom = (state, dom) => {
  const { $Viewlet } = state
  const $Root = document.createElement('div')
  VirtualDom.renderInto($Root, dom)
  const $TerminalTabs = $Root.firstChild
  // @ts-ignore
  $TerminalTabs.onclick = ViewletTerminalsEvents.handleClickTab
  if (state.$TerminalTabs) {
    state.$TerminalTabs.replaceWith($TerminalTabs)
  } else {
    $Viewlet.append($TerminalTabs)
  }
  state.$TerminalTabs = $TerminalTabs
}
