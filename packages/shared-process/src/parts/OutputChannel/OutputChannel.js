import { Tail } from 'tail'
import { VError } from '../VError/VError.js'

// TODO
// option 1: use tail child process
// option 2: https://www.npmjs.com/package/@logdna/tail-file
// option 3: node tail

export const open = (path, onData, onError) => {
  let tail
  try {
    tail = new Tail(path, {
      separator: null,
      fromBeginning: true,
    })
  } catch (error) {
    // @ts-ignore
    onError(error.toString())
  }

  if (tail) {
    tail.on('line', onData)

    tail.on('error', (error) => {
      onError(error.toString())
    })
  }
  const state = {
    tail,
  }
  return state
}

export const dispose = (state) => {
  try {
    if (state.tail) {
      state.tail.unwatch()
    }
  } catch (error) {
    throw new VError(error, `Failed to dispose output channel`)
  }
}
