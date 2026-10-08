import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchAuthWorker from '../LaunchAuthWorker/LaunchAuthWorker.js'

const { invoke, invokeAndTransfer, restart } = GetOrCreateWorker.getOrCreateWorker(LaunchAuthWorker.launchAuthWorker)

export const initialize = (backendUrl, platform, href) => {
  return invoke('Auth.initialize', {
    backendUrl,
    href,
    platform,
  })
}

export const signIn = (backendUrl, platform) => {
  return invoke('Auth.login', {
    backendUrl,
    platform,
  })
}

export const signOut = (backendUrl) => {
  return invoke('Auth.logout', {
    backendUrl,
  })
}

export const getAccounts = () => invoke('Auth.getAccounts')

export const getConnectedAccounts = () => invoke('Auth.getConnectedAccounts')

export const disconnectConnectedAccount = (provider) => invoke('Auth.disconnectConnectedAccount', provider)

export const useAccount = (id) => invoke('Auth.useAccount', id)

export const removeAccount = (id) => invoke('Auth.removeAccount', id)

export { invoke, invokeAndTransfer, restart }
