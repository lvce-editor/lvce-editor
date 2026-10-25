import * as Cloudflare from './Cloudflare.ts'

export const name = 'Cloudflare'

export const Commands = {
  authorizeBrowser: Cloudflare.authorizeBrowser,
  getAccountId: Cloudflare.getAccountId,
  getMachines: Cloudflare.getMachines,
  releaseAccountSession: Cloudflare.releaseAccountSession,
  openConnections: Cloudflare.openConnections,
}
