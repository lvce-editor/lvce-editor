import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const create = () => {
  return {
    message: '',
  }
}

export const loadContent = async (state) => {
  await RendererProcess.invoke('ScreenCapture.start')
  return {
    message: 'screen cast',
  }
}
