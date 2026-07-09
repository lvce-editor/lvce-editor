import { Tail } from 'tail'
import { VError } from '../VError/VError.ts'

// TODO
// option 1: use tail child process
// option 2: https://www.npmjs.com/package/@logdna/tail-file
// option 3: node tail

export const open = (path: any, onData: any, onError: any): any => {
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

    tail.on('error', (error: any) => {
      onError(error.toString())
    })
  }
  const state: any = {
    tail,
  }
  return state
}

export const dispose = (state: any): any => {
  try {
    if (state && state.tail) {
      state.tail.unwatch()
    }
  } catch (error) {
    throw new VError(error, `Failed to dispose output channel`)
  }
}
