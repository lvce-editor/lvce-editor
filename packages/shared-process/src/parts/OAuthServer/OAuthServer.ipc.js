import * as OAuthServer from './OAuthServer.js'

export const name = 'OAuthServer'

export const Commands = {
  create: OAuthServer.create,
  getCode: OAuthServer.getCode,
  dispose: OAuthServer.dispose,
}
