import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as DomAttributeType from '../DomAttributeType/DomAttributeType.js'
import * as Focus from '../Focus/Focus.js'
import * as GetNodeIndex from '../GetNodeIndex/GetNodeIndex.js'
import * as MouseEventType from '../MouseEventType/MouseEventType.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'

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
