import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'

export const getBrowserName = () => {
  // @ts-ignore
  const userAgentData = navigator.userAgentData
  if (userAgentData) {
    for (const brand of userAgentData.brands) {
      const actualBrand = brand.brand.toLowerCase()
      if (actualBrand === 'firefox') {
        return 'Firefox'
      }
      if (actualBrand === 'chromium') {
        return undefined
      }
    }
  }
  const userAgent = navigator.userAgent
  if (/firefox/i.test(userAgent)) {
    return 'Firefox'
  }
  if (/version\/[\d.]+.*safari/i.test(userAgent) && !/(chrome|chromium|crios|edg|opr|fxios)/i.test(userAgent)) {
    return 'Safari'
  }
  return undefined
}

// TODO if necessary support more browser detection
export const getBrowser = () => {
  if (Platform.getPlatform() === PlatformType.Electron) {
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
