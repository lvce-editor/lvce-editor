import * as GetContentSecurityPolicy from '../GetContentSecurityPolicy/GetContentSecurityPolicy.js'
import * as GetGitpodPreviewUrl from '../GetGitpodPreviewUrl/GetGitpodPreviewUrl.js'
import * as IsGitpod from '../IsGitpod/IsGitpod.js'

const getFrameSrc = () => {
  // TODO make ports configurable
  if (IsGitpod.isGitpod) {
    return [`frame-src 'self' ${GetGitpodPreviewUrl.getGitpodPreviewUrl(3001)} ${GetGitpodPreviewUrl.getGitpodPreviewUrl(3002)}`]
  }
  return [`frame-src 'self' http://localhost:3001 http://localhost:3002`]
}

const getManifestSrc = () => {
  return [`manifest-src 'self'`]
}

const getFrameAncestors = () => {
  if (IsGitpod.isGitpod) {
    return [`frame-ancestors *.gitpod.io`]
  }
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
  ...getSandbox(),
])
