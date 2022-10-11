// based on vscode's simple browser by Microsoft (https://github.com/microsoft/vscode/blob/e8fe2d07d31f30698b9262dd5e1fcc59a85c6bb1/extensions/simple-browser/src/extension.ts, License MIT)

export const name = 'SimpleBrowser'

export const create = () => {
  return {}
}

export const loadContent = (state) => {
  return {
    ...state,
    iframeSrc: 'https://example.com',
    // iframeSrc: 'https://www.w3schools.com',
  }
}

export const hasFunctionalRender = true

const renderIframeSrc = {
  isEqual(oldState, newState) {
    return oldState.iframeSrc === newState.iframeSrc
  },
  apply(oldState, newState) {
    return ['Viewlet.send', 'SimpleBrowser', 'setIframeSrc', newState.iframeSrc]
  },
}

export const render = [renderIframeSrc]
