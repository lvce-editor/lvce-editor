import * as Env from '../Env/Env.js'

export const isElectron = () => {
  return Boolean(Env.getElectronRunAsNode()) || 'electron' in process.versions
}
