import * as Open from '../Open/Open.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as Product from '../Product/Product.js'

export const openConnections = async (): Promise<void> => {
  const backendUrl = Preferences.get('layout.backendUrl') || Product.getBackendUrl()
  const url = new URL('/cloudflare', backendUrl)
  if (url.protocol !== 'https:' && !(url.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname))) {
    throw new Error('Cloudflare connections require an HTTPS authentication backend')
  }
  if (url.username || url.password) throw new Error('Authentication backend URL must not contain credentials')
  await Open.openUrl(url.href, false)
}
