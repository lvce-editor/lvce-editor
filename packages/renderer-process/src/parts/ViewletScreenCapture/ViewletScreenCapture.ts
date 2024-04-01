import * as ScreenCapture from '../ScreenCapture/ScreenCapture.ts'
import * as ViewletScreenCaptureEvents from './ViewletScreenCaptureEvents.ts'

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet ScreenCapture'
  return {
    $Viewlet,
  }
}

export const setScreenCapture = (state, id) => {
  const { $Viewlet } = state
  const $Video = document.createElement('video')
  const screenCapture = ScreenCapture.get(id)
  $Video.srcObject = screenCapture
  $Video.onloadedmetadata = ViewletScreenCaptureEvents.handleLoadedMetaData
  $Viewlet.append($Video)
}
