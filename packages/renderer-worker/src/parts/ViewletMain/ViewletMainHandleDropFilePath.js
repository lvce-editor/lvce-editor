import * as Assert from '../Assert/Assert.js'
import * as EditorSplitDirectionType from '../EditorSplitDirectionType/EditorSplitDirectionType.js'
import * as SplitDirectionType from '../EditorSplitDirectionType/EditorSplitDirectionType.js'
import * as GetEditorSplitDirectionType from '../GetEditorSplitDirectionType/GetEditorSplitDirectionType.js'
import * as GetSplitDimensions from '../GetSplitDimensions/GetSplitDimensions.js'
import * as IconTheme from '../IconTheme/IconTheme.js'
import * as Id from '../Id/Id.js'
import * as MeasureTabWidth from '../MeasureTabWidth/MeasureTabWidth.js'
import * as PathDisplay from '../PathDisplay/PathDisplay.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as SashOrientation from '../SashOrientation/SashOrientation.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'
import * as ViewletMap from '../ViewletMap/ViewletMap.js'
import * as ViewletModule from '../ViewletModule/ViewletModule.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import { openUri } from './ViewletMainOpenUri.js'

const getSashModuleId = (orientation) => {
  switch (orientation) {
    case SashOrientation.Horizontal:
      return ViewletModuleId.VisibleSashHorizontal
    case SashOrientation.Vertical:
      return ViewletModuleId.VisibleSashVertical
  }
}

export const handleDropFilePath = async (state, eventX, eventY, filePath) => {
  Assert.object(state)
  Assert.number(eventX)
  Assert.number(eventY)
  Assert.string(filePath)
  const { tabFontWeight, tabFontSize, tabFontFamily, tabLetterSpacing, x, y, width, height, tabHeight, groups, activeGroupIndex, uid } = state
  const splitDirection = GetEditorSplitDirectionType.getEditorSplitDirectionType(x, y + tabHeight, width, height - tabHeight, eventX, eventY)
  const allCommands = []
  let newState = state
  if (splitDirection === EditorSplitDirectionType.None) {
    console.log('no split')
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
    const id = ViewletMap.getModuleId(uri)
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
    // const branchItem = {
    //   type: 'branch',
    //   size: branchSize,
    //   childCount: 2,
    // }

    const newActiveGroupIndex = 1
    const tabLabel = PathDisplay.getLabel(uri)
    const tabTitle = PathDisplay.getTitle(uri)
    const icon = IconTheme.getFileNameIcon(uri)
    const tabWidth = MeasureTabWidth.measureTabWidth(tabLabel, tabFontWeight, tabFontSize, tabFontFamily, tabLetterSpacing)

    const leafItem = {
      type: 'leaf',
      size: leafSize,
      instanceUid,
      tabsUid,
      activeIndex: 0,
      x: overlayX,
      y: overlayY - tabHeight,
      width: overlayWidth,
      height: overlayHeight + tabHeight,
      editors: [
        {
          uri,
          uid: instanceUid,
          label: tabLabel,
          title: tabTitle,
          tabWidth,
          icon,
        },
      ],
    }
    let newGroups = groups
    if (splitDirection === SplitDirectionType.Down || splitDirection === SplitDirectionType.Right) {
      newGroups = [...groups, leafItem]
    } else {
      newGroups = [leafItem, ...groups]
    }

    const firstItem = newGroups[0]
    // resize content
    const resizeCommands = Viewlet.resize(firstItem.uid, { x: 0, y: 0, width: width - overlayWidth, height })
    console.log({ resizeCommands })
    allCommands.push(...resizeCommands)
    allCommands.push(['Viewlet.setBounds', firstItem.uid, originalX, originalY, originalWidth, originalHeight])
    // resize tabs
    allCommands.push(['Viewlet.setBounds', firstItem.tabsUid, originalTabsX, originalTabsY, originalTabsWidth, originalTabsHeight])
    // TODO
    // allCommands.push(Viewlet.resize())
    // @ts-ignore
    const commands = await ViewletManager.load(instance, false)
    console.log({ commands })
    allCommands.push(...commands)
    allCommands.push(['Viewlet.append', uid, instanceUid])
    // TODO when dropping up/left, prepend instead if append
    // allCommands.push([
    //   /* Viewlet.append */ 'Viewlet.appendCustom',
    //   /* parentId */ ViewletModuleId.Main,
    //   /* method */ 'appendContent',
    //   /* id  */ instanceUid,
    // ])
    // const sashOrientation = splitDirection===
    // TODO sash could be horizontal or vertical
    // const sashModuleId = getSashModuleId(sashOrientation)
    // await RendererProcess.invoke('Viewlet.loadModule', sashModuleId)
    // allCommands.push([/* Viewlet.create */ 'Viewlet.create', /* id */ sashModuleId, sashUid])
    // allCommands.push(['Viewlet.setBounds', sashUid, sashX, sashY, sashWidth, sashHeight])
    // allCommands.push(['Viewlet.append', ViewletModuleId.Main, sashUid])
    console.log({ allCommands, newGroups })
    // await RendererProcess.invoke(/* Viewlet.sendMultiple */ 'Viewlet.sendMultiple', /* commands */ allCommands)
    newState = {
      ...state,
      groups: newGroups,
      activeIndex: newActiveGroupIndex,
      dragOverlayX: 0,
      dragOverlayY: 0,
      dragOverlayWidth: 0,
      dragOverlayHeight: 0,
      dragOverlayVisible: false,
    }
  }
  return {
    newState,
    commands: allCommands,
  }
}
