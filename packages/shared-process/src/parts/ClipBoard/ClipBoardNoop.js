import * as Platform from '../Platform/Platform.js'

export const readFiles = async () => {
  return {
    source: 'notSupported',
    type: 'none',
    files: [],
  }
}

export const writeFiles = (type, files) => {
  const desktop = Platform.getDesktop()
  console.info(`writing files to clipboard is not yet supported on ${desktop}`)
}
