import * as ImagePreview from './ImagePreview.ts'

export const name = 'ImagePreview'

export const Commands = {
  create: ImagePreview.create,
  dispose: ImagePreview.dispose,
  showError: ImagePreview.showError,
  update: ImagePreview.update,
}
