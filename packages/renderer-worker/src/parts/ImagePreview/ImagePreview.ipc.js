import * as Command from '../Command/Command.js'
import * as ImagePreview from './ImagePreview.js'

// TODO only use ImagePreview module via ipc -> that way is is always lazyloaded

export const __initialize__ = () => {
  Command.register('ImagePreview.show', ImagePreview.show)
  Command.register('ImagePreview.hide', ImagePreview.hide)
}
