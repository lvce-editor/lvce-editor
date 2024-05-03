import * as Env from '../Env/Env.js'
import * as RgPath from '../RipGrepPath/RipGrepPath.js'

export const ripGrepPath = Env.getRipGrepPath() || RgPath.rgPath

export const spawn = (args, options) => {
  throw new Error('deprecated')
}

export const exec = async (args, options) => {
  throw new Error('deprecated')
}
