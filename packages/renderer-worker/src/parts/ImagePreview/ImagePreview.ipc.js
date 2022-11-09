import * as ImagePreview from './ImagePreview.js'

// TODO only use ImagePreview module via ipc -> that way is is always lazyloaded

export const name = 'ImagePreview'

export const Commands = {
  hide: ImagePreview.hide,
  show: ImagePreview.show,
}
