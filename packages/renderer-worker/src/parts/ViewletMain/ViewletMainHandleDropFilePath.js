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
import * as GetSplitDimensions from '../GetSplitDimensions/GetSplitDimensions.js'

const sashSize = 4
const sashVisibleSize = 1

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
  const splitDirection = GetEditorSplitDirectionType.getEditorSplitDirectionType(x, y + tabHeight, width, height - tabHeight, eventX, eventY)
  if (splitDirection === EditorSplitDirectionType.None) {
    await openUri(state, filePath)
    await RendererProcess.invoke(/* Viewlet.send */ 'Viewlet.send', /* id */ ViewletModuleId.Main, /* method */ 'stopHighlightDragOver')
    await RendererProcess.invoke(/* Viewlet.send */ 'Viewlet.send', /* id */ ViewletModuleId.Main, /* method */ 'hideDragOverlay')
  } else {
    const sashVisibleSize = 1
    const sashSize = 4
    const {
      originalX,
      originalY,
      originalWidth,
      originalHeight,
      originalTabsX,
      originalTabsY,
      originalTabsWidth,
      originalTabsHeight,
      overlayX,
      overlayY,
      overlayWidth,
      overlayHeight,
      overlayTabsX,
      overlayTabsY,
      overlayTabsWidth,
      overlayTabsHeight,
      sashX,
      sashY,
      sashWidth,
      sashHeight,
    } = GetSplitDimensions.getSplitDimensions(x, y, width, height, splitDirection, sashSize, sashVisibleSize, tabHeight)
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
    console.log({ resizeCommands })
    allCommands.push(...resizeCommands)
    allCommands.push(['Viewlet.setBounds', firstGridItem.uid, originalX, originalY, originalWidth, originalHeight])
    // resize tabs
    allCommands.push(['Viewlet.setBounds', firstGroupItem.uid, originalTabsX, originalTabsY, originalTabsWidth, originalTabsHeight])
    // TODO
    // allCommands.push(Viewlet.resize())
    allCommands.push([/* Viewlet.send */ 'Viewlet.send', /* id */ ViewletModuleId.Main, /* method */ 'stopHighlightDragOver'])
    allCommands.push([/* Viewlet.send */ 'Viewlet.send', /* id */ ViewletModuleId.Main, /* method */ 'hideDragOverlay'])
    allCommands.push(['Viewlet.create', ViewletModuleId.MainTabs, tabsId])
    allCommands.push(['Viewlet.send', tabsId, 'setTabs', [{ label: tabLabel, title: tabTitle }]])
    allCommands.push(['Viewlet.setBounds', tabsId, overlayTabsX, overlayTabsY, overlayTabsWidth, overlayTabsHeight])
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
      /* x */ sashX,
      /* y */ sashY,
      /* width */ sashWidth,
      /* height */ sashHeight,
    ])
    console.log({ allCommands })
    await RendererProcess.invoke(/* Viewlet.sendMultiple */ 'Viewlet.sendMultiple', /* commands */ allCommands)
  }
  return state
}
