import * as GetWindowId from '../GetWindowId/GetWindowId.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const getWindowZoomLevel = async () => {
  // TODO speed up resizing by avoid too many round trips
  const windowId = await GetWindowId.getWindowId()
  const zoomLevel = await SharedProcess.invoke('ElectronWindow.getZoom', windowId)
  return zoomLevel
}
