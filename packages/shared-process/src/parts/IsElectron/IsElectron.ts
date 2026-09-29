import * as Env from '../Env/Env.ts'

export const isElectron = Boolean(Env.getElectronRunAsNode()) || 'electron' in process.versions
