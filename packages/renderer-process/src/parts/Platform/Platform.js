import * as PlatformType from '../PlatformType/PlatformType.js'
/* istanbul ignore file */

// TODO this should always be completely tree shaken out during build

/**
 * @returns {'electron'|'remote'|'web'}
 */
const getPlatform = () => {
  // @ts-ignore
  if (typeof PLATFORM !== 'undefined') {
    // @ts-ignore
    return PLATFORM
  }
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
    return PlatformType.Remote
  }
  // @ts-ignore
  if (typeof myApi !== 'undefined') {
    return PlatformType.Electron
  }
  return PlatformType.Remote
}

export const platform = getPlatform()

// TODO treeshake this function out when targeting electron

export const state = {
  getAssetDir() {
    // @ts-ignore
    if (typeof ASSET_DIR !== 'undefined') {
      // @ts-ignore
      return ASSET_DIR
    }
    if (platform === 'electron') {
      return '../../../../..'
    }
    return ''
  },
  supportsHtml5Dialog() {
    const $Dialog = document.createElement('dialog')
    // @ts-ignore
    return typeof $Dialog.showModal === 'function'
  },
  isElectron() {
    return (
      // @ts-ignore
      window.myApi &&
      // @ts-ignore
      window.myApi.ipcConnect &&
      // @ts-ignore
      typeof window.myApi.ipcConnect === 'function'
    )
  },
}

// TODO if necessary support more browser detection
export const getBrowser = () => {
  if (platform === 'electron') {
    return 'electron'
  }
  // @ts-ignore
  const userAgentData = navigator.userAgentData
  if (userAgentData) {
    for (const brand of userAgentData.brands) {
      const actualBrand = brand.brand.toLowerCase()
      switch (actualBrand) {
        case 'firefox':
          return 'firefox'
        case 'chromium':
          return 'chromium'
        default:
          break
      }
    }
  }
  const userAgent = navigator.userAgent.toLowerCase()
  if (userAgent.includes('firefox')) {
    return 'firefox'
  }
  if (userAgent.includes('Electron')) {
    return 'electron'
  }
  return 'chromium'
}

export const assetDir = state.getAssetDir()

export const supportsHtml5Dialog = () => {
  return state.supportsHtml5Dialog()
}

export const isElectron = () => {
  return state.isElectron()
}

export const getRendererWorkerUrl = () => {
  const urlRendererWorker = `${assetDir}/packages/renderer-worker/src/rendererWorkerMain.js`
  return urlRendererWorker
}
