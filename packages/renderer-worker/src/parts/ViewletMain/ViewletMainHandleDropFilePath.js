import * as Assert from '../Assert/Assert.ts'
import * as EditorSplitDirectionType from '../EditorSplitDirectionType/EditorSplitDirectionType.js'
import * as SplitDirectionType from '../EditorSplitDirectionType/EditorSplitDirectionType.js'
import * as GetEditorSplitDirectionType from '../GetEditorSplitDirectionType/GetEditorSplitDirectionType.js'
import * as GetSplitDimensions from '../GetSplitDimensions/GetSplitDimensions.js'
import * as Id from '../Id/Id.js'
import * as PathDisplay from '../PathDisplay/PathDisplay.js'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'
import * as Workspace from '../Workspace/Workspace.js'
import * as ViewletModule from '../ViewletModule/ViewletModule.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import { openUri } from './ViewletMainOpenUri.ts'

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
  // @ts-ignore
  const { x, y, width, height, tabHeight, groups, activeGroupIndex, uid } = state
  const sashVisibleSize = 1
  const sashSize = 4
  const {
    // @ts-ignore
    originalX,
    // @ts-ignore
    originalY,
    // @ts-ignore
    originalWidth,
    // @ts-ignore
    originalHeight,
    // @ts-ignore
    originalTabsX,
    // @ts-ignore
    originalTabsY,
    // @ts-ignore
    originalTabsWidth,
    // @ts-ignore
    originalTabsHeight,
    overlayX,
    overlayY,
    overlayWidth,
    overlayHeight,
    // @ts-ignore
    overlayTabsX,
    // @ts-ignore
    overlayTabsY,
    // @ts-ignore
    overlayTabsWidth,
    // @ts-ignore
    overlayTabsHeight,
    // @ts-ignore
    sashX,
    // @ts-ignore
    sashY,
    // @ts-ignore
    sashWidth,
    // @ts-ignore
    sashHeight,
    // @ts-ignore
    sashOrientation,
    // @ts-ignore
    leafSize,
    // @ts-ignore
    branchSize,
  } = GetSplitDimensions.getSplitDimensions(x, y, width, height, splitDirection, sashSize, sashVisibleSize, tabHeight)
  // @ts-ignore
  const tabs = [
    {
      label: PathDisplay.getLabel(filePath),
      title: filePath,
    },
  ]
  const uri = filePath
  const id = ViewletModuleId.EditorText
  const instanceUid = Id.create()
  // @ts-ignore
  const tabsUid = Id.create()
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

  if (splitDirection === SplitDirectionType.Down || splitDirection === SplitDirectionType.Right) {
    const oldGroup = groups[0]
    const newOldGroup = {
      ...oldGroup,
      width: oldGroup.width / 2,
    }
    const newGroup = {
      activeIndex: 0,
      editors: [
        {
          icon: '',
          label: Workspace.pathBaseName(filePath),
          tabWidth: 100,
          title: Workspace.pathBaseName(filePath),
          uid: Id.create(),
          uri: filePath,
        },
      ],
      height: 530,
      tabsUid: Id.create(),
      uid: Id.create(),
      width: oldGroup.width / 2,
      x: oldGroup.width / 2,
      y: 0,
    }
    const newGroups = [newOldGroup, newGroup]
    return {
      ...state,
      groups: newGroups,
    }
  }
  // TODO

  // state.grid.unshift(branchItem)
  // console.log(state.grid)

  // state.activeIndex = state.grid.length - 1
  // const tabLabel = Workspace.pathBaseName(uri)
  // const tabTitle = PathDisplay.getTitle(uri)
  // const allCommands = []

  // const firstItem = grid[1]
  // // resize content
  // const resizeCommands = Viewlet.resize(firstItem.instanceUid, { x: 0, y: 0, width: width - overlayWidth, height })
  // allCommands.push(...resizeCommands)
  // allCommands.push(['Viewlet.setBounds', firstItem.instanceUid, originalX, originalY, originalWidth, originalHeight])
  // // resize tabs
  // allCommands.push(['Viewlet.setBounds', firstItem.tabdUid, originalTabsX, originalTabsY, originalTabsWidth, originalTabsHeight])
  // // TODO
  // // allCommands.push(Viewlet.resize())
  // allCommands.push([/* Viewlet.send */ 'Viewlet.send', /* id */ ViewletModuleId.Main, /* method */ 'stopHighlightDragOver'])
  // allCommands.push([/* Viewlet.send */ 'Viewlet.send', /* id */ ViewletModuleId.Main, /* method */ 'hideDragOverlay'])
  // allCommands.push(['Viewlet.create', ViewletModuleId.MainTabs, tabsUid])
  // allCommands.push(['Viewlet.send', tabsUid, 'setTabs', [{ label: tabLabel, title: tabTitle }]])
  // allCommands.push(['Viewlet.setBounds', tabsUid, overlayTabsX, overlayTabsY, overlayTabsWidth, overlayTabsHeight])
  // // @ts-ignore
  // const commands = await ViewletManager.load(instance, false)
  // allCommands.push(...commands)
  // // TODO when dropping up/left, prepend instead if append
  // allCommands.push([/* Viewlet.append */ 'Viewlet.appendCustom', /* parentId */ ViewletModuleId.Main, /* method */ 'appendTabs', /* id  */ tabsUid])
  // allCommands.push([
  //   /* Viewlet.append */ 'Viewlet.appendCustom',
  //   /* parentId */ ViewletModuleId.Main,
  //   /* method */ 'appendContent',
  //   /* id  */ instanceUid,
  // ])
  // // const sashOrientation = splitDirection===
  // // TODO sash could be horizontal or vertical
  // const sashModuleId = GetSashModuleId.getSashModuleId(sashOrientation)
  // await RendererProcess.invoke('Viewlet.loadModule', sashModuleId)
  // allCommands.push([/* Viewlet.create */ 'Viewlet.create', /* id */ sashModuleId, sashUid])
  // allCommands.push(['Viewlet.setBounds', sashUid, sashX, sashY, sashWidth, sashHeight])
  // allCommands.push(['Viewlet.append', ViewletModuleId.Main, sashUid])
  // await RendererProcess.invoke(/* Viewlet.sendMultiple */ 'Viewlet.sendMultiple', /* commands */ allCommands)
  return state
}

export const handleDropFilePath = async (state, eventX, eventY, filePath) => {
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
