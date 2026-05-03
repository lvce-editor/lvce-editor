import * as AuthWorker from '../AuthWorker/AuthWorker.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as Product from '../Product/Product.js'

const getInitialBackendUrl = () => {
  return Preferences.get('layout.backendUrl') || Product.getBackendUrl()
}

export const initializeAuth = () => {
  return AuthWorker.invoke('Auth.syncBackendAuth', getInitialBackendUrl())
}
