import * as AuthWorker from '../AuthWorker/AuthWorker.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as Product from '../Product/Product.js'

const getInitialBackendUrl = () => {
  return Preferences.get('layout.backendUrl') || Product.getBackendUrl()
}

export const initializeAuth = (platform, href) => {
  return AuthWorker.initialize(getInitialBackendUrl(), platform, href)
}
