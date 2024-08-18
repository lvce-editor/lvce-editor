import * as GetContentSecurityPolicy from '../GetContentSecurityPolicy/GetContentSecurityPolicy.js'
import * as IsElectron from '../IsElectron/IsElectron.js'
import * as IsGitpod from '../IsGitpod/IsGitpod.js'

const getGitpodPreviewUrl = (port) => {
  const workspaceId = process.env.GITPOD_WORKSPACE_ID
  const cluster = process.env.GITPOD_WORKSPACE_CLUSTER
  const url = `https://${port}-${workspaceId}.${cluster}`
  return url
}

export const value = GetContentSecurityPolicy.getContentSecurityPolicy([
  `default-src 'none'`,
  `font-src 'self'`,
  `img-src 'self' https: data:`,
  `media-src 'self'`,
  `script-src 'self'`,
  `style-src 'self'`,
  `frame-ancestors 'none' `,
  IsGitpod.isGitpod
    ? `frame-src 'self' ${getGitpodPreviewUrl(3001)} ${getGitpodPreviewUrl(3002)}`
    : `frame-src 'self' http://localhost:3001 http://localhost:3002`,
  ...(IsElectron.isElectron ? [] : [`manifest-src 'self'`]),
])
