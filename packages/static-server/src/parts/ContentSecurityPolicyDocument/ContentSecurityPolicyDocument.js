import * as GetContentSecurityPolicy from '../GetContentSecurityPolicy/GetContentSecurityPolicy.js'

const getFrameSrc = ({ isForElectronProduction, applicationName }) => {
  if (isForElectronProduction) {
    return [`frame-src ${applicationName}-webview:`]
  }
  return [`frame-src 'self' ${applicationName}-webview: http://localhost:3001 http://localhost:3002`]
}

const getManifestSrc = () => {
  return [`manifest-src 'self'`]
}

const getFrameAncestors = () => {
  return [`frame-ancestors 'none'`]
}

const getSandbox = () => {
  // disabled because chrome devtools shows a warning
  // for some reason when sandbox is enabled
  if (Math) {
    return []
  }
  return [`sandbox allow-scripts allow-same-origin`]
}

export const getValue = ({ isForElectronProduction, applicationName }) =>
  GetContentSecurityPolicy.getContentSecurityPolicy([
    `default-src 'none'`,
    `font-src 'self'`,
    `img-src 'self' https: data: blob:`, // TODO maybe disallow https and data images
    `media-src 'self'`,
    `script-src 'self'`,
    `style-src 'self'`,
    ...getFrameAncestors(),
    ...getFrameSrc({ isForElectronProduction, applicationName }),
    ...getManifestSrc(),
    ...getSandbox(),
  ])
