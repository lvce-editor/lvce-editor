import * as Assert from '../Assert/Assert.ts'
import type { EditorGroup } from '../EditorGroup/EditorGroup.ts'
import * as Id from '../Id/Id.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'
import * as ViewletMap from '../ViewletMap/ViewletMap.js'
import * as ViewletModule from '../ViewletModule/ViewletModule.js'

const getNewGroups = (groups: readonly EditorGroup[], x: number, y: number, width: number, height: number): readonly EditorGroup[] => {
  if (groups.length === 0) {
    return [
      {
        x: x,
        y: y,
        width: width / 2,
        height: height,
        editors: [],
        tabsUid: 0,
        activeIndex: -1,
      },
      {
        x: x + width / 2,
        y: y,
        width: width / 2,
        height: height,
        editors: [],
        tabsUid: 0,
        activeIndex: -1,
      },
    ]
  }
  const lastGroup = groups.at(-1)
  if (!lastGroup) {
    throw new Error('missing last group')
  }
  const lastEditor = lastGroup.editors.at(-1)
  return [
    ...groups.slice(0, -1),
    {
      ...lastGroup,
      x: lastGroup.x,
      y: lastGroup.y,
      width: lastGroup.width / 2,
      height: lastGroup.height,
      activeIndex: -1,
    },
    {
      x: lastGroup.x + lastGroup.width / 2,
      y: lastGroup.y,
      width: lastGroup.width / 2,
      height: lastGroup.height,
      editors: [lastEditor],
      tabsUid: 0,
      activeIndex: -1,
    },
  ]
}

export const splitRight = async (state) => {
  const { groups, x, y, width, height, tabHeight } = state
  const newGroups = getNewGroups(groups, x, y, width, height)
  const commands: any[] = []
  const lastGroup = newGroups.at(-2)
  if (!lastGroup) {
    throw new Error('group not found')
  }
  const { activeIndex, editors, tabsUid } = lastGroup
  let editor = editors[activeIndex]
  if (activeIndex === -1 && editors.length > 0) {
    editor = editors[0]
  }
  const contentHeight = height - tabHeight
  const dimensions = {
    x: lastGroup.x,
    y: y + lastGroup.y + tabHeight,
    width: lastGroup.width,
    height: contentHeight,
  }
  if (editor) {
    const editorUid = editor.uid
    Assert.number(editorUid)
    const resizeCommands = await Viewlet.resize(editorUid, dimensions)
    commands.push(...resizeCommands)
    commands.push(['Viewlet.setBounds', editorUid, dimensions.x, tabHeight, dimensions.width, contentHeight])
  }
  if (tabsUid !== -1) {
    commands.push(['Viewlet.setBounds', tabsUid, dimensions.x, 0, dimensions.width, tabHeight])
  }

  if (groups.length === 0) {
    return state
  }

  const realEditor = lastGroup.editors.at(-1)
  const moduleId = await ViewletMap.getModuleId(realEditor.uri)
  const instanceUid = Id.create()
  // TODO resize the editor in first group
  // TODO use half width for editor in second group
  const instance = ViewletManager.create(
    ViewletModule.load,
    moduleId,
    state.uid,
    realEditor.uri,
    x + width / 2,
    y + tabHeight,
    width / 2,
    contentHeight,
  )
  // @ts-ignore
  instance.show = false
  instance.setBounds = false
  instance.uid = instanceUid
  // @ts-ignore
  const instanceCommands = await ViewletManager.load(instance, true)
  const newGroup = newGroups.at(-1)
  if (!newGroup) {
    throw new Error('new group not found')
  }
  instanceCommands.push(['Viewlet.setBounds', instanceUid, newGroup.x, state.tabHeight, newGroup.width, contentHeight])

  instanceCommands.push(['Viewlet.append', state.uid, instanceUid])
  if (true) {
    instanceCommands.push(['Viewlet.focus', instanceUid])
  }

  const allCommands = [...commands, ...instanceCommands]
  return {
    newState: {
      ...state,
      groups: newGroups,
    },
    commands: allCommands,
  }
}
