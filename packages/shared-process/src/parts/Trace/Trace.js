import * as Env from '../Env/Env.js'

export const LEVEL = {
  DEFAULT: 1,
  VERBOSE: 2,
}

export const state = {
  level: LEVEL.VERBOSE,
}

export const trace =
  Env.getNodeEnv() === 'test'
    ? () => {}
    : (...args) => {
        console.info('[Trace]', ...args)
      }
