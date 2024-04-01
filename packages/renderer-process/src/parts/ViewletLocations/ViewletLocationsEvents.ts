import * as GetNodeIndex from '../GetNodeIndex/GetNodeIndex.ts'
import * as MouseEventType from '../MouseEventType/MouseEventType.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const handleLocationsMouseDown = (event) => {
  if (event.button !== MouseEventType.LeftClick) {
    return
  }
  const $Target = event.target
  if ($Target.classList.contains('TreeItem')) {
    const index = GetNodeIndex.getNodeIndex($Target)
    RendererWorker.send(/* ViewletLocations.selectIndex */ 'Locations.selectIndex', /* index */ index)
  } else if ($Target.classList.contains('LocationList')) {
    RendererWorker.send(/* ViewletLocations.focusIndex */ 'Locations.focusIndex', /* index */ -1)
  }
}
