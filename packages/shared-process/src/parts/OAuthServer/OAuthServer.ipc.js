import * as OAuthServer from './OAuthServer.js'

export const name = 'OAuthServer'

export const Commands = {
  create: OAuthServer.create,
  dispose: OAuthServer.dispose,
}
