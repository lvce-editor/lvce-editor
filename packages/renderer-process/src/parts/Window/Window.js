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
  const handleVisibilityChange = async () => {
    RendererWorker.send(
      /* SaveState.handleVisibilityChange */ 'SaveState.handleVisibilityChange',
      /* visibilityState */ document.visibilityState
    )
    await new Promise((resolve, reject) => {
      setTimeout(resolve, 100)
    })
    console.log('timeout done')
  }
  // document.addEventListener('visibilitychange', handleVisibilityChange)
  const handleBeforeUnload = async () => {
    RendererWorker.send(
      /* SaveState.handleVisibilityChange */ 'SaveState.handleVisibilityChange',
      /* visibilityState */ 'hidden'
    )
    // setTimeout(() => {
    //   console.log('in timeout 1')
    // }, 3)
    // await new Promise((resolve, reject) => {
    //   setTimeout(resolve, 100)
    // })
    // console.log('timeout done')
  }
  window.addEventListener('beforeunload', handleBeforeUnload)
  // document.addEventListener('visibilitychange', handleVisibilityChange)

  // const handlePageHide = () => {
  //   console.log('page hide')
  //   RendererWorker.send(
  //     /* SaveState.handleVisibilityChange */ 'SaveState.handleVisibilityChange',
  //     /* visibilityState */ 'hidden'
  //   )
  // }
  // window.addEventListener('pagehide', handlePageHide)
}
