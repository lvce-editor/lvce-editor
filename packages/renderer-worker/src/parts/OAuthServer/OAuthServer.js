import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const create = (id, successHtml, errorHtml) => {
  return SharedProcess.invoke('OAuthServer.create', id, successHtml, errorHtml)
}

export const getCode = (id) => {
  return SharedProcess.invoke('OAuthServer.getCode', id)
}

export const dispose = (id) => {
  return SharedProcess.invoke('OAuthServer.dispose', id)
}
