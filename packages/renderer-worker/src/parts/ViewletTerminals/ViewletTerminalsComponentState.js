const getTerminalUids = (tab) => tab.terminalUids || [tab.uid]

export const getComponentState = (state) => state

export const setComponentState = (currentState, componentState) => {
  if (!componentState || typeof componentState !== 'object' || Array.isArray(componentState)) {
    throw new TypeError('Terminals state must be an object')
  }
  if (componentState.uid !== currentState.uid) {
    throw new Error(`Terminals state uid must remain ${currentState.uid}`)
  }
  if (!Array.isArray(componentState.tabs) || componentState.tabs.length !== currentState.tabs.length) {
    throw new Error('Terminals tabs must keep their current identities')
  }
  const tabs = currentState.tabs.map((currentTab, index) => {
    const tab = componentState.tabs[index]
    if (!tab || tab.uid !== currentTab.uid) {
      throw new Error('Terminals tabs must keep their current identities')
    }
    const currentTerminalUids = getTerminalUids(currentTab)
    const terminalUids = getTerminalUids(tab)
    if (!Array.isArray(terminalUids) || terminalUids.length !== currentTerminalUids.length || terminalUids.some((uid, terminalIndex) => uid !== currentTerminalUids[terminalIndex])) {
      throw new Error('Terminals splits must keep their current identities')
    }
    if (typeof tab.label !== 'string') {
      throw new TypeError('Terminal tab label must be a string')
    }
    return tab.label === currentTab.label ? currentTab : { ...currentTab, label: tab.label }
  })
  return tabs.every((tab, index) => tab === currentState.tabs[index]) ? currentState : { ...currentState, tabs }
}
