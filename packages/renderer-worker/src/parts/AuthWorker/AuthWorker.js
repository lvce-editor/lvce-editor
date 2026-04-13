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

export { invoke, invokeAndTransfer, restart }
