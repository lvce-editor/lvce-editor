import * as Assert from '../Assert/Assert.js'
import * as EditorSplitDirectionType from '../EditorSplitDirectionType/EditorSplitDirectionType.js'
import * as SplitDirectionType from '../EditorSplitDirectionType/EditorSplitDirectionType.js'
import * as GetEditorSplitDirectionType from '../GetEditorSplitDirectionType/GetEditorSplitDirectionType.js'
import * as GetSashModuleId from '../GetSashModuleId/GetSashModuleId.js'
import * as GetSplitDimensions from '../GetSplitDimensions/GetSplitDimensions.js'
import * as Id from '../Id/Id.js'
import * as PathDisplay from '../PathDisplay/PathDisplay.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'
import * as ViewletMap from '../ViewletMap/ViewletMap.js'
import * as ViewletModule from '../ViewletModule/ViewletModule.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as Workspace from '../Workspace/Workspace.js'
import { openUri } from './ViewletMainOpenUri.js'

const handleDropFilePathNoSplit = async (state, filePath) => {
  const { newState, commands } = await openUri(state, filePath)
  return {
    newState: {
      ...newState,
      dragOverlayX: 0,
      dragOverlayY: 0,
      dragOverlayWidth: 0,
      dragOverlayHeight: 0,
      dragOverlayVisible: false,
    },
    commands,
  }
}

const handleDropFilePathSplit = async (state, eventX, eventY, filePath, splitDirection) => {
  const { tabFontWeight, tabFontSize, tabFontFamily, tabLetterSpacing, x, y, width, height, tabHeight, groups, activeGroupIndex, uid } = state
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
    sashOrientation,
    leafSize,
    branchSize,
  } = GetSplitDimensions.getSplitDimensions(x, y, width, height, splitDirection, sashSize, sashVisibleSize, tabHeight)
  const tabs = [
    {
      label: PathDisplay.getLabel(filePath),
      title: filePath,
    },
  ]
  const uri = filePath
  const id = ViewletMap.getId(uri)
  const instanceUid = Id.create()
  const tabsUid = Id.create()
  const sashUid = Id.create()
  const instance = ViewletManager.create(ViewletModule.load, id, state.uid, uri, overlayX, overlayY, overlayWidth, overlayHeight)
  instance.show = false
  instance.uid = instanceUid
  // const sashGridItem = {
  //   x: sashX,
  //   y: sashY,
  //   width: sashWidth,
  //   height: sashHeight,
  //   uid: sashUid,
  //   childCount: 0,
  // }
  // const tabsGridItem = {
  //   x: overlayTabsX,
  //   y: overlayTabsY,
  //   width: overlayTabsWidth,
  //   height: overlayTabsHeight,
  //   uri,
  //   uid: tabsUid,
  //   childCount: 1,
  // }
  const branchItem = {
    type: 'branch',
    size: branchSize,
    childCount: 2,
  }
  const leafItem = {
    type: 'leaf',
    size: leafSize,
    instanceUid,
    tabsUid,
    editors: [],
  }
  if (splitDirection === SplitDirectionType.Down || splitDirection === SplitDirectionType.Right) {
    state.grid.push(leafItem)
  } else {
    state.grid.unshift(leafItem)
  }
  state.grid.unshift(branchItem)
  console.log(state.grid)

  state.activeIndex = state.grid.length - 1
  const tabLabel = Workspace.pathBaseName(uri)
  const tabTitle = PathDisplay.getTitle(uri)
  const allCommands = []

  const firstItem = grid[1]
  // resize content
  const resizeCommands = Viewlet.resize(firstItem.instanceUid, { x: 0, y: 0, width: width - overlayWidth, height })
  console.log({ resizeCommands })
  allCommands.push(...resizeCommands)
  allCommands.push(['Viewlet.setBounds', firstItem.instanceUid, originalX, originalY, originalWidth, originalHeight])
  // resize tabs
  allCommands.push(['Viewlet.setBounds', firstItem.tabdUid, originalTabsX, originalTabsY, originalTabsWidth, originalTabsHeight])
  // TODO
  // allCommands.push(Viewlet.resize())
  allCommands.push([/* Viewlet.send */ 'Viewlet.send', /* id */ ViewletModuleId.Main, /* method */ 'stopHighlightDragOver'])
  allCommands.push([/* Viewlet.send */ 'Viewlet.send', /* id */ ViewletModuleId.Main, /* method */ 'hideDragOverlay'])
  allCommands.push(['Viewlet.create', ViewletModuleId.MainTabs, tabsUid])
  allCommands.push(['Viewlet.send', tabsUid, 'setTabs', [{ label: tabLabel, title: tabTitle }]])
  allCommands.push(['Viewlet.setBounds', tabsUid, overlayTabsX, overlayTabsY, overlayTabsWidth, overlayTabsHeight])
  // @ts-ignore
  const commands = await ViewletManager.load(instance, false)
  allCommands.push(...commands)
  // TODO when dropping up/left, prepend instead if append
  allCommands.push([/* Viewlet.append */ 'Viewlet.appendCustom', /* parentId */ ViewletModuleId.Main, /* method */ 'appendTabs', /* id  */ tabsUid])
  allCommands.push([
    /* Viewlet.append */ 'Viewlet.appendCustom',
    /* parentId */ ViewletModuleId.Main,
    /* method */ 'appendContent',
    /* id  */ instanceUid,
  ])
  // const sashOrientation = splitDirection===
  // TODO sash could be horizontal or vertical
  const sashModuleId = GetSashModuleId.getSashModuleId(sashOrientation)
  await RendererProcess.invoke('Viewlet.loadModule', sashModuleId)
  allCommands.push([/* Viewlet.create */ 'Viewlet.create', /* id */ sashModuleId, sashUid])
  allCommands.push(['Viewlet.setBounds', sashUid, sashX, sashY, sashWidth, sashHeight])
  allCommands.push(['Viewlet.append', ViewletModuleId.Main, sashUid])
  console.log({ allCommands })
  await RendererProcess.invoke(/* Viewlet.sendMultiple */ 'Viewlet.sendMultiple', /* commands */ allCommands)
  return state
}

export const handleDropFilePath = async (state, eventX, eventY, filePath) => {
  console.log({ filePath })
  Assert.object(state)
  Assert.number(eventX)
  Assert.number(eventY)
  Assert.string(filePath)
  const { x, y, width, height, tabHeight } = state
  const splitDirection = GetEditorSplitDirectionType.getEditorSplitDirectionType(x, y + tabHeight, width, height - tabHeight, eventX, eventY)
  if (splitDirection === EditorSplitDirectionType.None) {
    return handleDropFilePathNoSplit(state, filePath)
  }
  return handleDropFilePathSplit(state, eventX, eventY, filePath, splitDirection)
}
