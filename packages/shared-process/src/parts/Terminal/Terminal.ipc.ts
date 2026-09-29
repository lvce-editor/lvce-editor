import * as Terminal from './Terminal.ts'

export const name = 'Terminal'

export const Commands = {
  create: Terminal.create,
  dispose: Terminal.dispose,
  resize: Terminal.resize,
  write: Terminal.write,
}
