import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as Assert from '../Assert/Assert.js'

export const state = {
  /**
   * @type {any[]}
   */
  statusBarItems: [],
  /**
   * @type {any[]}
   */
  changeListeners: [],
}

// TODO this could be more granular: when only one status bar item changes, not all items should be requested again
const handleStatusBarItemChange = () => {
  for (const changeListener of state.changeListeners) {
    changeListener()
  }
}

export const registerStatusBarItem = (statusBarItem) => {
  state.statusBarItems.push(statusBarItem)
  if (statusBarItem.create) {
    const statusBarItemState = statusBarItem.create()
    statusBarItem.initialize(statusBarItemState)
    statusBarItemState.emitter.addListener('change', handleStatusBarItemChange)
  }
  handleStatusBarItemChange()
}

const getItem = (x) => {
  if (x.getItem) {
    return x.getItem()
  }
  return {
    id: '',
  }
}

export const getStatusBarItems = () => {
  // console.log('get status bar items')
  const rendererState = state.statusBarItems.map(getItem).filter(Boolean)
  // console.log({ rendererState })
  // console.log({ state })
  return rendererState
}

const JSON_RPC_VERSION = '2.0'

export const registerChangeListener = (id) => {
  Assert.number(id)
  const handleChange = () => {
    SharedProcess.send({
      jsonrpc: JSON_RPC_VERSION,
      method: /* Listener.execute */ 3444,
      params: [id],
    })
  }
  state.changeListeners.push(handleChange)
}
