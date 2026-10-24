import * as Cloudflare from './Cloudflare.ts'

export const name = 'Cloudflare'

export const Commands = {
  openConnections: Cloudflare.openConnections,
}
