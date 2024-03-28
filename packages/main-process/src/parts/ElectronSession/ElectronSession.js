import * as CreateElectronSession from '../CreateElectronSession/CreateElectronSession.js'

export const state = {
  /**
   * @type {any}
   */
  session: undefined,
}

export const get = () => {
  state.session ||= CreateElectronSession.createElectronSession()
  return state.session
}
