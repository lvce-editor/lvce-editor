import * as Command from '../Command/Command.js'
import * as ImagePreview from './ImagePreview.js'

export const __initialize__ = () => {
  Command.register(3666, ImagePreview.create)
  Command.register(3667, ImagePreview.dispose)
  Command.register(3668, ImagePreview.update)
  Command.register(3669, ImagePreview.showError)
}
