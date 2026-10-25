import * as Authentication from './Authentication.ts'

export const name = 'Authentication'
export const Commands = {
  beginAccountChange: Authentication.beginAccountChange,
  endAccountChange: Authentication.endAccountChange,
  getAccountChangeState: Authentication.getAccountChangeState,
  getAccounts: Authentication.getAccounts,
  getAccessToken: Authentication.getAccessToken,
  getBackendUrl: Authentication.getBackendUrl,
}
