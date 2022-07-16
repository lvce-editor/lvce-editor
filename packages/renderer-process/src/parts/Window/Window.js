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

// cannot use visibilty change event because worker cannot process events when page closes
// https://stackoverflow.com/questions/20084348/what-happens-to-a-web-worker-if-i-close-the-page-that-created-this-web-worker/20105455#20105455
export const onVisibilityChange = () => {
  // const handleVisibilityChange = () => {
  //   RendererWorker.send(
  //     /* SaveState.handleVisibilityChange */ 'SaveState.handleVisibilityChange',
  //     /* visibilityState */ document.visibilityState
  //   )
  // }
  // document.addEventListener('visibilitychange', handleVisibilityChange)
  const handleBeforeUnload = () => {
    RendererWorker.send(
      /* SaveState.handleVisibilityChange */ 'SaveState.handleVisibilityChange',
      /* visibilityState */ 'hidden'
    )
  }
  window.addEventListener('beforeunload', handleBeforeUnload)
}
