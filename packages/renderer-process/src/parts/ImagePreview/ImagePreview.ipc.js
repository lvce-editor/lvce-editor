import * as Command from '../Command/Command.js'
import * as ImagePreview from './ImagePreview.js'

export const __initialize__ = () => {
  Command.register('ImagePreview.create', ImagePreview.create)
  Command.register('ImagePreview.dispose', ImagePreview.dispose)
  Command.register('ImagePreview.update', ImagePreview.update)
  Command.register('ImagePreview.showError', ImagePreview.showError)
}
