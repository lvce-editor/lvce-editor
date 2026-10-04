import { VError } from '@lvce-editor/verror'
import * as Copy from '../Copy/Copy.ts'

export const bundleRendererProcess = async ({ cachePath }) => {
  try {
    await Copy.copy({
      from: 'packages/renderer-worker/node_modules/@lvce-editor/renderer-process',
      to: `${cachePath}`,
      dereference: true,
    })
  } catch (error) {
    throw new VError(error, `Failed to bundle renderer process`)
  }
}
