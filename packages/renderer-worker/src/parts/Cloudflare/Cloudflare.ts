import * as AuthWorker from '../AuthWorker/AuthWorker.js'
import * as ExtensionHostCommands from '../ExtensionHost/ExtensionHostCommands.js'
import * as Open from '../Open/Open.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as Product from '../Product/Product.js'
import { createAccountClient } from './RemoteAccountClient.ts'

export const openConnections = async (): Promise<void> => {
  const backendUrl = Preferences.get('layout.backendUrl') || Product.getBackendUrl()
  const url = new URL('/cloudflare', backendUrl)
  if (url.protocol !== 'https:' && !(url.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname))) {
    throw new Error('Cloudflare connections require an HTTPS authentication backend')
  }
  if (url.username || url.password) throw new Error('Authentication backend URL must not contain credentials')
  await Open.openUrl(url.href, false)
}

const client = createAccountClient({
  backendUrl: () => Preferences.get('layout.backendUrl') || Product.getBackendUrl(),
  fetch,
  getAccounts: AuthWorker.getAccounts,
  getToken: (refresh) => AuthWorker.invoke('Auth.getAccessToken', refresh ? { refresh: 'if-needed' } : {}),
})
export const { authorizeBrowser, getAccountId, getMachines } = client

export const releaseAccountSession = async (): Promise<void> => {
  if (Platform.getPlatform() === PlatformType.Web) {
    try {
      await ExtensionHostCommands.executeCommand('remote-server.disconnectAccount')
    } catch {
      /* Local disconnect already precedes remote revocation; signing out must remain available offline. */
    }
  }
}
