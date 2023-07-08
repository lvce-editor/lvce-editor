import * as PtyController from './PtyController.js'

export const name = 'Terminal'

export const Commands = {
  create: PtyController.create,
  write: PtyController.write,
  dispose: PtyController.dispose,
}
