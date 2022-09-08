import * as ImagePreview from './ImagePreview.js'

// TODO only use ImagePreview module via ipc -> that way is is always lazyloaded

export const Commands = {
  'ImagePreview.hide': ImagePreview.hide,
  'ImagePreview.show': ImagePreview.show,
}
