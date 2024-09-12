import * as GetContentSecurityPolicy from '../GetContentSecurityPolicy/GetContentSecurityPolicy.js'
import * as GetGitpodPreviewUrl from '../GetGitpodPreviewUrl/GetGitpodPreviewUrl.js'
import * as IsElectron from '../IsElectron/IsElectron.js'
import * as IsGitpod from '../IsGitpod/IsGitpod.js'
import * as Scheme from '../Scheme/Scheme.js'

const getFrameSrc = () => {
  // TODO make ports configurable
  if (IsGitpod.isGitpod) {
    return [`frame-src 'self' ${GetGitpodPreviewUrl.getGitpodPreviewUrl(3001)} ${GetGitpodPreviewUrl.getGitpodPreviewUrl(3002)}`]
  }
  if (IsElectron.isElectron) {
    return [`frame-src ${Scheme.WebView}:`]
  }
  return [`frame-src 'self' blob: http://localhost:3001 http://localhost:3002`]
}

const getManifestSrc = () => {
  if (IsElectron.isElectron) {
    return []
  }
  return [`manifest-src 'self'`]
}

const getFrameAncestors = () => {
  return [`frame-ancestors 'none'`]
}

export const value = GetContentSecurityPolicy.getContentSecurityPolicy([
  `default-src 'none'`,
  `font-src 'self'`,
  `img-src 'self' https: data: blob:`, // TODO maybe disallow https and data images
  `media-src 'self'`,
  `script-src 'self'`,
  `style-src 'self'`,
  ...getFrameAncestors(),
  ...getFrameSrc(),
  ...getManifestSrc(),
])
