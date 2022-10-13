import * as ChromeExtensionType from '../ChromeExtensionType/ChromeExtensionType.js'

const getUrlUBlockOrigin = () => {
  const version = `1.44.5b14`
  return `https://github.com/gorhill/uBlock/releases/download/${version}/uBlock0_${version}.chromium.zip`
}

const getUrlUBlockOriginLight = () => {
  const version = `0.1.22.10135`
  return `https://github.com/gorhill/uBlock/releases/download/uBOLite_${version}/uBOLite_${version}.mv3.zip`
}

const getUrlIStillDontCareAboutCookies = () => {
  const version = `1.0.5`
  return `https://github.com/OhMyGuus/I-Dont-Care-About-Cookies/releases/download/V${version}/IDCAC-chrome-source.zip`
}

export const getUrl = (name) => {
  switch (name) {
    case ChromeExtensionType.UBlockOrigin:
      return getUrlUBlockOrigin()
    case ChromeExtensionType.UBlockOriginLight:
      return getUrlUBlockOriginLight()
    case ChromeExtensionType.IStillDontCareAboutCookies:
      return getUrlIStillDontCareAboutCookies()
    default:
      throw new Error(`not yet supported: ${name}`)
  }
}
