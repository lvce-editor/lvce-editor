import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const create = (id) => {
  return SharedProcess.invoke('OAuthServer.create', id)
}

export const dispose = (id) => {
  return SharedProcess.invoke('OAuthServer.dispose', id)
}