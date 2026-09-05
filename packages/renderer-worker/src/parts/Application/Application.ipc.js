import * as Application from './Application.ts'

export const name = 'Application'

export const Commands = {
  create: Application.create,
  dispose: Application.dispose,
  execute: Application.execute,
  executeForView: Application.executeForView,
  resize: Application.resize,
}
