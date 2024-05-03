import * as Env from '../Env/Env.js'

export const isElectron = Boolean(Env.getElectronRunAsNode()) || 'electron' in process.versions
