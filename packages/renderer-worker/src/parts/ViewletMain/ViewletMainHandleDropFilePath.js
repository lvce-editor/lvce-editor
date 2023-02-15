import * as EditorSplitDirectionType from '../EditorSplitDirectionType/EditorSplitDirectionType.js'
import * as GetEditorSplitDirectionType from '../GetEditorSplitDirectionType/GetEditorSplitDirectionType.js'
import * as GetSplitOverlayDimensions from '../GetSplitOverlayDimensions/GetSplitOverlayDimensions.js'
import * as Id from '../Id/Id.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'
import * as ViewletMap from '../ViewletMap/ViewletMap.js'
import * as ViewletModule from '../ViewletModule/ViewletModule.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as Workspace from '../Workspace/Workspace.js'
import { openUri } from './ViewletMainOpenUri.js'

const getTabTitle = (uri) => {
  const homeDir = Workspace.getHomeDir()
  // TODO tree shake this out in web
  if (homeDir && uri.startsWith(homeDir)) {
    return `~${uri.slice(homeDir.length)}`
  }
  return uri
}

export const handleDropFilePath = async (state, eventX, eventY, filePath) => {
  const { x, y, width, height, tabHeight, grid } = state
  console.log({ x, y, width, height, tabHeight, grid: [...grid], eventX, eventY })
  const splitDirection = GetEditorSplitDirectionType.getEditorSplitDirectionType(x, y + tabHeight, width, height - tabHeight, eventX, eventY)
  if (splitDirection === EditorSplitDirectionType.None) {
    await openUri(state, filePath)
    await RendererProcess.invoke(/* Viewlet.send */ 'Viewlet.send', /* id */ ViewletModuleId.Main, /* method */ 'stopHighlightDragOver')
    await RendererProcess.invoke(/* Viewlet.send */ 'Viewlet.send', /* id */ ViewletModuleId.Main, /* method */ 'hideDragOverlay')
  } else {
    const sashVisibleSize = 1
    const { overlayX, overlayY, overlayWidth, overlayHeight } = GetSplitOverlayDimensions.getSplitOverlayDimensions(
      x,
      y + tabHeight,
      width,
      height - tabHeight,
      splitDirection,
      sashVisibleSize
    )
    const tabs = [
      {
        label: Workspace.pathBaseName(filePath),
        title: filePath,
      },
    ]
    const uri = filePath
    const id = ViewletMap.getId(uri)
    const uid = Id.create()
    const tabsId = Id.create()
    const instance = ViewletManager.create(ViewletModule.load, id, ViewletModuleId.Main, uri, x, y, width, height)
    instance.show = false
    instance.uid = uid
    state.grid.push({ uri, uid })
    state.activeIndex = state.grid.length - 1
    const tabLabel = Workspace.pathBaseName(uri)
    const tabTitle = getTabTitle(uri)
    const allCommands = []
    const firstGroupItem = state.grid[0]
    const firstGridItem = state.grid[1]
    // resize content
    const resizeCommands = Viewlet.resize(firstGridItem.uid, { x: 0, y: 0, width: width - overlayWidth, height })
    allCommands.push(['Viewlet.setBounds', firstGridItem.uid, 0, tabHeight, width - overlayWidth, height])
    allCommands.push(...resizeCommands)
    allCommands.push(['Viewlet.setBounds', firstGridItem.uid, 0, tabHeight, width - overlayWidth, height])
    // resize tabs
    allCommands.push(['Viewlet.setBounds', firstGroupItem.uid, 0, 0, width - overlayWidth, tabHeight])
    // TODO
    // allCommands.push(Viewlet.resize())
    allCommands.push([/* Viewlet.send */ 'Viewlet.send', /* id */ ViewletModuleId.Main, /* method */ 'stopHighlightDragOver'])
    allCommands.push([/* Viewlet.send */ 'Viewlet.send', /* id */ ViewletModuleId.Main, /* method */ 'hideDragOverlay'])
    allCommands.push(['Viewlet.create', ViewletModuleId.MainTabs, tabsId])
    allCommands.push(['Viewlet.send', tabsId, 'setTabs', [{ label: tabLabel, title: tabTitle }]])
    allCommands.push(['Viewlet.setBounds', tabsId, overlayX, overlayY - y - tabHeight, overlayWidth, tabHeight])
    // @ts-ignore
    const commands = await ViewletManager.load(instance, false)
    allCommands.push(...commands)
    allCommands.push([/* Viewlet.append */ 'Viewlet.appendCustom', /* parentId */ ViewletModuleId.Main, /* method */ 'appendTabs', /* id  */ tabsId])
    // TODO sash could be horizontal or vertical
    allCommands.push([
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ ViewletModuleId.Main,
      /* method */ 'addSash',
      /* id */ '',
      /* x */ overlayX,
      /* y */ overlayY - y - tabHeight,
      /* width */ 4,
      /* height */ overlayHeight + tabHeight,
    ])
    await RendererProcess.invoke(/* Viewlet.sendMultiple */ 'Viewlet.sendMultiple', /* commands */ allCommands)
  }
  return state
}
