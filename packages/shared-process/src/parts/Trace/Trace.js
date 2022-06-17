export const LEVEL = {
  DEFAULT: 1,
  VERBOSE: 2,
}

export const state = {
  level: LEVEL.VERBOSE,
}

export const trace =
  process.env.NODE_ENV === 'test'
    ? () => {}
    : (...args) => {
        console.info('[Trace]', ...args)
      }
