import * as GetContentSecurityPolicy from '../GetContentSecurityPolicy/GetContentSecurityPolicy.js'
import * as IsElectron from '../IsElectron/IsElectron.js'
import * as IsGitpod from '../IsGitpod/IsGitpod.js'
import * as Platform from '../Platform/Platform.js'

const getGitpodPreviewUrl = (port) => {
  const workspaceId = process.env.GITPOD_WORKSPACE_ID
  const cluster = process.env.GITPOD_WORKSPACE_CLUSTER_HOST
  const url = `https://${port}-${workspaceId}.${cluster}`
  return url
}

const getFrameSrc = () => {
  if (IsGitpod.isGitpod) {
    return [`frame-src 'self' ${getGitpodPreviewUrl(3001)} ${getGitpodPreviewUrl(3002)}`]
  }
  if (IsElectron.isElectron) {
    return [`frame-src lvce-webview:`]
  }
  return [`frame-src 'self' http://localhost:3001 http://localhost:3002`]
}

const getManifestSrc = () => {
  if (IsElectron.isElectron) {
    return []
  }
  return [`manifest-src 'self'`]
}

const getFrameAncestors = () => {
  if (IsElectron.isElectron) {
    // TODO only support this for webviews, not for the app
    return [`frame-ancestors ${Platform.scheme}:`]
  }
  return [`frame-ancestors 'none'`]
}

export const value = GetContentSecurityPolicy.getContentSecurityPolicy([
  `default-src 'none'`,
  `font-src 'self'`,
  `img-src 'self' https: data:`, // TODO maybe disallow https and data images
  `media-src 'self'`,
  `script-src 'self'`,
  `style-src 'self'`,
  ...getFrameAncestors(),
  ...getFrameSrc(),
  ...getManifestSrc(),
])
