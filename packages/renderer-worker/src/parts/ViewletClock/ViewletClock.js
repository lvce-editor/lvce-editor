import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const name = 'Clock'

export const create = (id, uri, left, top, width, height) => {
  return {
    id,
    interval: -1,
    disposed: false,
  }
}

export const loadContent = (state) => {
  const update = async () => {
    await RendererProcess.invoke(
      /* Viewlet.invoke */ 'Viewlet.send',
      /* id */ state.id,
      /* method */ 'setTime',
      /* time */ Date.now()
    )
  }
  return {
    ...state,
    interval: setInterval(update, 1000),
  }
}

// TODO use contentLoadedEffects

export const contentLoaded = async (state) => {}

export const dispose = (state) => {
  clearInterval(state.interval)
  state.interval = -1
  state.disposed = true
}
