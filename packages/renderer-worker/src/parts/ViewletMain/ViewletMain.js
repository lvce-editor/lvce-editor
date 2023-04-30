import * as Arrays from '../Arrays/Arrays.js'
import * as Assert from '../Assert/Assert.js'
import * as BackgroundTabs from '../BackgroundTabs/BackgroundTabs.js'
import * as Command from '../Command/Command.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as GetEditorSplitDirectionType from '../GetEditorSplitDirectionType/GetEditorSplitDirectionType.js'
import * as GetSplitOverlayDimensions from '../GetSplitOverlayDimensions/GetSplitOverlayDimensions.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as Id from '../Id/Id.js'
import * as LifeCycle from '../LifeCycle/LifeCycle.js'
import * as LifeCyclePhase from '../LifeCyclePhase/LifeCyclePhase.js'
import * as MeasureTabWidth from '../MeasureTabWidth/MeasureTabWidth.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import * as MouseEventType from '../MouseEventType/MouseEventType.js'
import * as PathDisplay from '../PathDisplay/PathDisplay.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'
import * as ViewletMap from '../ViewletMap/ViewletMap.js'
import * as ViewletModule from '../ViewletModule/ViewletModule.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as Workspace from '../Workspace/Workspace.js'
import { closeEditor } from './ViewletMainCloseEditor.js'
import { openUri } from './ViewletMainOpenUri.js'

const COLUMN_WIDTH = 9 // TODO compute this automatically once

// interface Editor {
//  readonly uri: string
//  readonly type: string
// }

// interface EditorLazy {
//  readonly type: 'lazy'
// }

// interface EditorText extends Editor {
//   readonly textDocument: TextDocument
//   readonly type: 'text'
// }

// interface EditorIframe extends Editor {
//  readonly srcdoc: string
//  readonly type: 'iframe'
// }

// interface EditorImage extends Editor {
//   readonly src: string
//   readonly type: 'image'
// }

// interface EditorVideo extends Editor {
//   readonly src: string
//   readonly type: 'video'
// }

const canBeRestored = (editor) => {
  return typeof editor.uri === 'string' && typeof editor.uid === 'number' && FileSystem.canBeRestored(editor.uri)
}

const getMainGroups = (savedState, state) => {
  if (!savedState) {
    return []
  }
  const { groups, activeGroupIndex } = savedState
  const { tabFontWeight, tabFontSize, tabFontFamily, tabLetterSpacing } = state
  if (!groups || !Array.isArray(groups)) {
    return []
  }
  const restoredGroups = []
  for (const group of groups) {
    if (!group || !group.editors) {
      continue
    }
    const restoredEditors = group.editors.filter(canBeRestored)
    for (const editor of restoredEditors) {
      editor.uid = Id.create()
      const label = editor.label
      editor.tabWidth = MeasureTabWidth.measureTabWidth(label, tabFontWeight, tabFontSize, tabFontFamily, tabLetterSpacing)
    }
  }
  // TODO check that type is string (else runtime error occurs and page is blank)
  return restoredGroups
}

const hydrateLazy = async () => {
  // TODO this should be in extension host
  await Command.execute(/* EditorDiagnostics.hydrate */ 'EditorDiagnostics.hydrate')
}

export const create = (id, uri, x, y, width, height) => {
  return {
    groups: [],
    activeGroupIndex: -1,
    x,
    y,
    width,
    height,
    uid: id,
    moduleId: ViewletModuleId.Main,
    tabHeight: 35,
    dragOverlayX: 0,
    dragOverlayY: 0,
    dragOverlayWidth: 0,
    dragOverlayHeight: 0,
    dragOverlayVisible: false,
    tabsUid: -1,
    pendingUid: 0,
    tabFontFamily: 'system-ui, Ubuntu, Droid Sans, sans-serif',
    tabFontSize: 13,
    tabLetterSpacing: 0,
    tabFontWeight: 400,
    tabScrollBarVisible: false,
  }
}

// const showEditor = async (uri, languageId, content) => {
//   if (state.activeEditor) {
//     // TODO duplicate code in if/else
//     // state.editors = [state.activeEditor]
//     // Editor.replaceOne(state.activeEditor, uri, languageId, content)
//     // TODO replace editor
//   } else {
//     // state.activeEditor = Editor.create(1, uri, languageId, content)
//     // state.editors = [state.activeEditor]
//     // Editor.openOne(state.activeEditor)
//     // TODO create editor group and new editor
//   }

//   // TODO send type of editor
//   // 1 normal
//   // 2 side by side (settings.json, git diff, preview)
//   // 3 image
//   // 4 video
//   // 5 iframe (maybe 3/4 could also be iframe)
//   // Editor.initialSync(state.activeEditor)

//   // TODO use idlecallback maybe (after 350ms or something)
//   // TODO maybe use indexeddb instead
//   // TODO store all open editors
//   // await Command.execute(/* LocalStorage.setJson */ 6901, 'Main.editors', [uri])
// }

// TODO there is also openEditor function

const findEditorWithUri = (editors, uri) => {
  for (const [i, editor] of editors.entries()) {
    if (editor.uri === uri) {
      return i
    }
  }
  return -1
}

const getSavedActiveIndex = (savedState, restoredEditors) => {
  if (!savedState) {
    return -1
  }
  const savedActiveIndex = savedState.activeIndex
  if (typeof savedActiveIndex !== 'number' || savedActiveIndex < 0 || savedActiveIndex > restoredEditors.length) {
    return -1
  }
  return savedActiveIndex
}

const getRestoredGroups = (savedState, state) => {
  if (Workspace.isTest()) {
    return { groups: [], activeGroupIndex: -1 }
  }
  const restoredGroups = getMainGroups(savedState, state)
  const savedActiveIndex = getSavedActiveIndex(savedState, restoredGroups)
  if (savedActiveIndex === -1) {
    return { groups: [], activeGroupIndex: -1 }
  }
  return {
    groups: restoredGroups,
    activeGroupIndex: savedActiveIndex,
  }
}

export const saveState = (state) => {
  const { groups, activeGroupIndex } = state
  return { groups, activeGroupIndex }
}

const handleEditorChange = async (editor) => {
  const state = ViewletStates.getState(ViewletModuleId.Main)
  const index = state.activeIndex
  Assert.number(index)
  const tabsUid = state.tabsUid
  const command = ['Viewlet.send', tabsUid, 'setDirty', index, true]
  await RendererProcess.invoke(...command)
}

export const loadContent = async (state, savedState) => {
  // TODO get restored editors from saved state
  const { activeIndex, groups } = getRestoredGroups(savedState, state)
  // @ts-ignore
  LifeCycle.once(LifeCyclePhase.Twelve, hydrateLazy)
  GlobalEventBus.addListener('editor.change', handleEditorChange)
  await RendererProcess.invoke('Viewlet.loadModule', ViewletModuleId.MainTabs)
  return {
    ...state,
    groups,
    activeIndex,
  }
}

export const getChildren = (state) => {
  const { groups } = state
  if (groups.length === 0) {
    return []
  }
  const editor = groups[0]
  return [
    // {
    //   id: ViewletModuleId.MainTabs,
    // },
  ]
}

// TODO content loaded should return commands which
// get picked up by viewletlayout and sent to renderer process
export const contentLoaded = async (state) => {
  if (state.groups.length === 0) {
    return []
  }
  const commands = []
  for (const group of state.groups) {
    const editor = Arrays.last(group.editors)
    const x = state.x
    const y = state.y + state.tabHeight
    const width = state.width
    const contentHeight = state.height - state.tabHeight
    const id = ViewletMap.getModuleId(editor.uri)
    const tabLabel = PathDisplay.getLabel(editor.uri)
    const tabTitle = PathDisplay.getTitle(editor.uri)
    editor.label = tabLabel
    editor.title = tabTitle
    const childUid = editor.uid
    commands.push(['Viewlet.setBounds', childUid, x, state.tabHeight, width, contentHeight])
    const tabsUid = Id.create()
    state.tabsUid = tabsUid
    // commands.push(['Viewlet.create', ViewletModuleId.MainTabs, tabsUid])
    // commands.push(['Viewlet.send', tabsUid, 'setTabs', state.editors])
    // commands.push(['Viewlet.send', tabsUid, 'setFocusedIndex', -1, state.activeIndex])
    // commands.push(['Viewlet.setBounds', tabsUid, x, 0, width, state.tabHeight])
    // // @ts-ignore
    const extraCommands = await ViewletManager.load(
      {
        getModule: ViewletModule.load,
        id,
        // @ts-ignore
        uid: childUid,
        // @ts-ignore
        parentUid: state.uid,
        uri: editor.uri,
        x,
        y,
        width,
        height: contentHeight,
        show: false,
        focus: false,
        type: 0,
        setBounds: false,
        visible: true,
      },
      /* focus */ false,
      /* restore */ true
    )
    // @ts-ignore
    commands.push(...extraCommands)
    commands.push(['Viewlet.setBounds', childUid, x, state.tabHeight, width, contentHeight])
    // commands.push(['Viewlet.append', state.uid, tabsUid])
    commands.push(['Viewlet.append', state.uid, childUid])
  }
  return commands
}

export const openBackgroundTab = async (state, initialUri, props) => {
  const id = ViewletMap.getModuleId(initialUri)
  const tabLabel = 'Loading'
  const tabTitle = 'Loading'
  await RendererProcess.invoke(
    /* Viewlet.send */ 'Viewlet.send',
    /* id */ ViewletModuleId.Main,
    /* method */ 'openViewlet',
    /* tabLabel */ tabLabel,
    /* tabTitle */ tabTitle,
    /* oldActiveIndex */ -1,
    /* background */ true
  )
  const y = state.y + state.tabHeight
  const x = state.x
  const width = state.width
  const height = state.height - state.tabHeight
  const { title, uri } = await ViewletManager.backgroundLoad({
    getModule: ViewletModule.load,
    id,
    x,
    y,
    width,
    height,
    props,
  })

  state.editors.push({ uri })
  BackgroundTabs.add(uri, { uri, title, ...props })
  await RendererProcess.invoke('Viewlet.send', 'Main', 'updateTab', 1, title)
  // TODO update tab title with new title
  return state
}

const executeEditorCommand = async (editor, commandId) => {
  const uid = editor.uid
  await Viewlet.executeViewletCommand(uid, commandId)
}

const saveEditor = (editor) => {
  return executeEditorCommand(editor, 'save')
}

const focusEditor = (editor) => {
  return executeEditorCommand(editor, 'focus')
}

export const save = async (state) => {
  const { editors, activeIndex } = state
  if (activeIndex === -1) {
    return state
  }
  const editor = editors[activeIndex]
  await saveEditor(editor)
  // TODO handle different types of editors / custom editors / webviews
  // Command.execute(/* EditorSave.editorSave */ 'Editor.save')
  const command = ['Viewlet.send', state.tabsUid, 'setDirty', activeIndex, false]
  await RendererProcess.invoke(...command)
  return state
}

export const focus = async (state) => {
  const { editors, activeIndex } = state
  if (activeIndex === -1) {
    return state
  }
  const editor = editors[activeIndex]
  await focusEditor(editor)
  return state
}

// const getEditor = (uri) => {
//   const protocol = 'file://' + uri.slice(0, 0)
//   switch (protocol) {
//     case 'file://':
//       // TODO open normal editor
//       break
//     case 'performance://monitor':
//       return import('../EditorPerformance.js')
//     case 'performance://startup':
//       return import('../EditorPerformanceStartup.js')
//     default:
//       // ask extension host for custom editor
//       break
//   }
// }

export const openEditorWithType = async (file) => {
  // TODO resolve custom editors from extension host
  // then open extension host custom editor or normal editor
}

export const saveWithoutFormatting = async () => {
  console.warn('not implemented')
}

export const handleDrop = async (state, files) => {
  const allCommands = []
  let newState = state
  for (const file of files) {
    if (file.path) {
      const result = await openUri(state, file.path)
      allCommands.push(...result.commands)

      newState = result.newState
    } else {
      // TODO
    }
  }
  return {
    newState: {
      ...newState,
      dragOverlayX: 0,
      dragOverlayY: 0,
      dragOverlayWidth: 0,
      dragOverlayHeight: 0,
      dragOverlayVisible: false,
    },
    commands: allCommands,
  }
}

export const handleDropFilePath = async (state, filePath) => {
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

export const handleDragEnd = async (state, x, y) => {
  return {
    ...state,
    dragOverlayX: 0,
    dragOverlayY: 0,
    dragOverlayWidth: 0,
    dragOverlayHeight: 0,
    dragOverlayVisible: false,
  }
}

export const handleDragOver = (state, eventX, eventY) => {
  const { x, y, width, height, tabHeight } = state
  const splitDirection = GetEditorSplitDirectionType.getEditorSplitDirectionType(x, y + tabHeight, width, height - tabHeight, eventX, eventY)
  const { overlayX, overlayY, overlayWidth, overlayHeight } = GetSplitOverlayDimensions.getSplitOverlayDimensions(
    x,
    y + tabHeight,
    width,
    height - tabHeight,
    splitDirection
  )
  return {
    ...state,
    dragOverlayX: overlayX,
    dragOverlayY: overlayY,
    dragOverlayWidth: overlayWidth,
    dragOverlayHeight: overlayHeight,
    dragOverlayVisible: true,
  }
}

export const dispose = () => {}

export const handleClickClose = (state, button, index) => {
  if (button !== MouseEventType.LeftClick) {
    return state
  }
  return closeEditor(state, index)
}

export const closeFocusedTab = (state) => {
  return closeEditor(state, state.focusedIndex)
}

export const handleTabContextMenu = async (state, index, x, y) => {
  state.focusedIndex = index
  await Command.execute(/* ContextMenu.show */ 'ContextMenu.show', /* x */ x, /* y */ y, /* id */ MenuEntryId.Tab)
  return {
    ...state,
    focusedIndex: index,
  }
}

export const handleFocusChange = (state, isFocused) => {
  if (!isFocused) {
    const autoSavePreference = Preferences.get('files.autoSave')
    if (autoSavePreference === 'onFocusChange') {
      return save(state)
    }
  }
  return state
}
