import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const reload = () => {
  location.reload()
}

export const minimize = () => {}

export const maximize = () => {}

export const unmaximize = () => {}

export const close = () => {
  // window.close()
}

export const setTitle = (title) => {
  document.title = title
}

const sendVisibilityChangeHint = () => {
  RendererWorker.send(
    /* SaveState.handleVisibilityChange */ 'SaveState.handleVisibilityChange',
    /* visibilityState */ 'hidden'
  )
}

const handleBeforeUnload = () => {
  sendVisibilityChangeHint()
}
const handlePointerLeave = () => {
  sendVisibilityChangeHint()
}

// cannot use visibilty change event because worker cannot process events when page closes
// https://stackoverflow.com/questions/20084348/what-happens-to-a-web-worker-if-i-close-the-page-that-created-this-web-worker/20105455#20105455
// beforeunload event has the same problem, pointerleave event sometimes works
export const onVisibilityChange = () => {
  window.addEventListener('beforeunload', handleBeforeUnload)
  document.addEventListener('pointerleave', handlePointerLeave)
}
