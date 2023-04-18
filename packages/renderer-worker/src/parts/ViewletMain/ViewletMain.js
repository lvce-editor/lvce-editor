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
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import * as MouseEventType from '../MouseEventType/MouseEventType.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'
import * as ViewletMap from '../ViewletMap/ViewletMap.js'
import * as ViewletModule from '../ViewletModule/ViewletModule.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as Workspace from '../Workspace/Workspace.js'

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

const getMainEditors = (state) => {
  if (!state) {
    return []
  }
  const { editors, activeIndex } = state
  if (!editors) {
    return []
  }
  const restoredEditor = editors.filter(canBeRestored)[activeIndex]
  if (!restoredEditor) {
    return []
  }
  // TODO check that type is string (else runtime error occurs and page is blank)
  return [restoredEditor]
}

const hydrateLazy = async () => {
  // TODO this should be in extension host
  await Command.execute(/* EditorDiagnostics.hydrate */ 'EditorDiagnostics.hydrate')
}

export const create = (id, uri, x, y, width, height) => {
  return {
    editors: [],
    activeIndex: -1,
    focusedIndex: -1,
    x,
    y,
    width,
    height,
    uid: id,
    moduleId: ViewletModuleId.Main,
    tabHeight: 35,
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

const getTabTitle = (uri) => {
  const homeDir = Workspace.getHomeDir()
  // TODO tree shake this out in web
  if (homeDir && uri.startsWith(homeDir)) {
    return `~${uri.slice(homeDir.length)}`
  }
  return uri
}

const findEditorWithUri = (editors, uri) => {
  for (const [i, editor] of editors.entries()) {
    if (editor.uri === uri) {
      return i
    }
  }
  return -1
}

const getRestoredEditors = (savedState) => {
  if (Workspace.isTest()) {
    return []
  }
  const restoredEditors = getMainEditors(savedState)
  return restoredEditors
}

export const saveState = (state) => {
  const { editors, activeIndex } = state
  return { editors, activeIndex }
}

const handleEditorChange = async (editor) => {
  const state = ViewletStates.getState(ViewletModuleId.Main)
  const index = state.activeIndex
  Assert.number(index)
  const command = ['Viewlet.send', state.uid, 'setDirty', index, true]
  await RendererProcess.invoke(...command)
}

export const loadContent = (state, savedState) => {
  // TODO get restored editors from saved state
  const editors = getRestoredEditors(savedState)
  // @ts-ignore
  LifeCycle.once(LifeCyclePhase.Twelve, hydrateLazy)
  const activeIndex = editors.length > 0 ? 0 : -1
  GlobalEventBus.addListener('editor.change', handleEditorChange)

  return {
    ...state,
    editors,
    activeIndex,
  }
}

export const getChildren = (state) => {
  const { editors } = state
  if (editors.length === 0) {
    return []
  }
  const editor = editors[0]
  return [
    // {
    //   id: ViewletModuleId.MainTabs,
    // },
  ]
}

// TODO content loaded should return commands which
// get picked up by viewletlayout and sent to renderer process
export const contentLoaded = async (state) => {
  if (state.editors.length === 0) {
    return []
  }
  const editor = Arrays.last(state.editors)
  const x = state.x
  const y = state.y + state.tabHeight
  const width = state.width
  const height = state.height - state.tabHeight
  const id = ViewletMap.getModuleId(editor.uri)
  const tabLabel = Workspace.pathBaseName(editor.uri)
  const tabTitle = getTabTitle(editor.uri)
  const commands = [
    [/* Viewlet.send */ 'Viewlet.send', /* id */ state.uid, /* method */ 'openViewlet', /* tabLabel */ tabLabel, /* tabTitle */ tabTitle],
  ]

  // // TODO race condition: Viewlet may have been resized before it has loaded
  const childUid = Id.create()
  // // @ts-ignore
  const extraCommands = await ViewletManager.load(
    {
      getModule: ViewletModule.load,
      id,
      // @ts-ignore
      uid: childUid,
      // @ts-ignore
      parentId: ViewletModuleId.Main,
      uri: editor.uri,
      x,
      y,
      width,
      height,
      show: false,
      focus: false,
      type: 0,
      setBounds: false,
      visible: true,
    },
    /* focus */ false,
    /* restore */ true
  )
  commands.push(...extraCommands)

  // if (extraCommands[0].includes(ViewletModuleId.Error)) {
  // commands.push(['Viewlet.appendViewlet', state.uid, ViewletModuleId.Error])
  // } else {
  commands.push(['Viewlet.appendViewlet', state.uid, childUid])
  // }
  return commands
}

export const openUri = async (state, uri, focus = true, options = {}) => {
  Assert.object(state)
  Assert.string(uri)
  const x = state.x
  const y = state.y + state.tabHeight
  const width = state.width
  const height = state.height - state.tabHeight
  const moduleId = ViewletMap.getModuleId(uri)

  for (const editor of state.editors) {
    if (editor.uri === uri) {
      console.log('found existing editor')
      const childUid = Id.create()
      // TODO if the editor is already open, nothing needs to be done
      const instance = ViewletManager.create(ViewletModule.load, moduleId, ViewletModuleId.Main, uri, x, y, width, height)
      instance.show = false
      instance.setBounds = false
      instance.uid = childUid
      // @ts-ignore
      const commands = await ViewletManager.load(instance, focus, false, options)
      commands.push(['Viewlet.appendViewlet', state.uid, childUid])
      return {
        newState: state,
        commands,
      }
    }
  }

  const instanceUid = Id.create()
  const instance = ViewletManager.create(ViewletModule.load, moduleId, ViewletModuleId.Main, uri, x, y, width, height)
  instance.uid = instanceUid
  const oldActiveIndex = state.activeIndex
  state.editors.push({ uri, uid: instanceUid })
  state.activeIndex = state.editors.length - 1
  const tabLabel = Workspace.pathBaseName(uri)
  const tabTitle = getTabTitle(uri)
  await RendererProcess.invoke(
    /* Viewlet.send */ 'Viewlet.send',
    /* id */ state.uid,
    /* method */ 'openViewlet',
    /* tabLabel */ tabLabel,
    /* tabTitle */ tabTitle,
    /* oldActiveIndex */ oldActiveIndex
  )
  // @ts-ignore
  instance.show = false
  instance.setBounds = false
  // @ts-ignore
  const commands = await ViewletManager.load(instance, focus)
  // if (commands[0].includes(ViewletModuleId.Error)) {
  //   commands.push(['Viewlet.appendViewlet', state.uid, ViewletModuleId.Error])
  // } else {
  commands.push(['Viewlet.appendViewlet', state.uid, instanceUid || moduleId])
  if (focus) {
    commands.push(['Viewlet.focus', instanceUid])
  }
  // }
  if (!ViewletStates.hasInstance(moduleId)) {
    return {
      newState: state,
      commands,
    }
  }
  const actualUri = ViewletStates.getState(moduleId).uri
  const index = state.editors.findIndex((editor) => editor.uid === instanceUid)
  state.editors[index].uri = actualUri
  return {
    newState: state,
    commands,
  }
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
  const id = getId(editor)
  console.log({ editor })
  const actualId = id === 'EditorText' ? 'Editor' : id
  const fullCommandId = `${actualId}.${commandId}`
  await Command.execute(fullCommandId)
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
  const command = ['Viewlet.send', ViewletModuleId.Main, 'setDirty', activeIndex, false]
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
    console.log(file)
  }
  allCommands.push([/* Viewlet.send */ 'Viewlet.send', /* id */ state.uid, /* method */ 'stopHighlightDragOver'])
  allCommands.push([/* Viewlet.send */ 'Viewlet.send', /* id */ state.uid, /* method */ 'hideDragOverlay'])
  return {
    newState,
    commands: allCommands,
  }
}

export const handleDropFilePath = async (state, filePath) => {
  await openUri(state, filePath)
  await RendererProcess.invoke(/* Viewlet.send */ 'Viewlet.send', /* id */ ViewletModuleId.Main, /* method */ 'stopHighlightDragOver')
  await RendererProcess.invoke(/* Viewlet.send */ 'Viewlet.send', /* id */ ViewletModuleId.Main, /* method */ 'hideDragOverlay')
  return state
}

export const handleDragEnd = async (state, x, y) => {
  await RendererProcess.invoke(/* Viewlet.send */ 'Viewlet.send', /* id */ ViewletModuleId.Main, /* method */ 'stopHighlightDragOver')
  await RendererProcess.invoke(/* Viewlet.send */ 'Viewlet.send', /* id */ ViewletModuleId.Main, /* method */ 'hideDragOverlay')
  return state
}

export const handleDragOver = async (state, eventX, eventY) => {
  const { x, y, width, height } = state
  const splitDirection = GetEditorSplitDirectionType.getEditorSplitDirectionType(
    x,
    y + state.tabHeight,
    width,
    height - state.tabHeight,
    eventX,
    eventY
  )
  const { overlayX, overlayY, overlayWidth, overlayHeight } = GetSplitOverlayDimensions.getSplitOverlayDimensions(
    x,
    y + state.tabHeight,
    width,
    height - state.tabHeight,
    splitDirection
  )
  // TODO show overlay for left area
  await RendererProcess.invoke(
    /* Viewlet.send */ 'Viewlet.send',
    /* id */ ViewletModuleId.Main,
    /* method */ 'showDragOverlay',
    overlayX,
    overlayY,
    overlayWidth,
    overlayHeight
  )
  await RendererProcess.invoke(/* Viewlet.send */ 'Viewlet.send', /* id */ ViewletModuleId.Main, /* method */ 'highlightDragOver')
  return state
}

export const closeActiveEditor = (state) => {
  const { editors, activeIndex } = state
  if (activeIndex === -1) {
    return state
  }
  return closeEditor(state, activeIndex)
}

const getId = (editor) => {
  return ViewletMap.getModuleId(editor.uri)
}

export const closeAllEditors = async (state) => {
  const ids = state.editors.map(getId)
  const uid = state.uid
  const commands = [['Viewlet.send', uid, 'dispose'], ...ids.flatMap(Viewlet.disposeFunctional)]
  // RendererProcess.invoke(/* Viewlet.send */ 'Viewlet.send', /* id */ ViewletModuleId.Main, /* method */ 'dispose')
  state.editors = []
  state.focusedIndex = -1
  state.selectedIndex = -1
  // TODO should call dispose method, but only in renderer-worker
  await RendererProcess.invoke('Viewlet.sendMultiple', commands)
  return state
}

export const dispose = () => {}

export const closeEditor = async (state, index) => {
  if (state.editors.length === 0) {
    return state
  }
  if (state.editors.length === 1) {
    return closeAllEditors(state)
  }
  const y = state.y
  const x = state.x
  const width = state.width
  const height = state.height
  if (index === state.activeIndex) {
    const oldActiveIndex = state.activeIndex
    const oldEditor = state.editors[index]
    state.editors.splice(index, 1)
    const newActiveIndex = index === 0 ? index : index - 1
    const id = ViewletMap.getModuleId(oldEditor.uri)
    Viewlet.dispose(id)
    state.activeIndex = newActiveIndex
    state.focusedIndex = newActiveIndex
    // const instance = Viewlet.create(id, 'uri', left, top, width, height)
    // TODO ideally content would load synchronously and there would be one layout and one paint for opening the new tab
    // except in the case where the content takes long (>100ms) to load, then it should show the tab
    // and for the content a loading spinner or (preferred) a progress bar
    // that it replaced with the actual content once it has been loaded
    // await instance.factory.refresh(instance.state, {
    //   uri: previousEditor.uri,
    //   top: instance.state.top,
    //   left: instance.state.left,
    //   height: instance.state.height,
    //   columnWidth: COLUMN_WIDTH,
    // })
    await RendererProcess.invoke(
      'Viewlet.send',
      state.uid,
      /* Main.closeOneTab */ 'closeOneTab',
      /* closeIndex */ oldActiveIndex,
      /* focusIndex */ newActiveIndex
    )
    return state
  }
  await RendererProcess.invoke(/* Viewlet.send */ 'Viewlet.send', /* id */ state.uid, /* method */ 'closeOneTabOnly', /* closeIndex */ index)
  state.editors.splice(index, 1)
  if (index < state.activeIndex) {
    state.activeIndex--
  }
  state.focusedIndex = state.activeIndex
  // TODO just close the tab
  return state
}

export const closeFocusedTab = (state) => {
  return closeEditor(state.focusedIndex)
}

export const handleTabContextMenu = async (state, index, x, y) => {
  await Command.execute(/* ContextMenu.show */ 'ContextMenu.show', /* x */ x, /* y */ y, /* id */ MenuEntryId.Tab)
  return {
    ...state,
    focusedIndex: index,
  }
}

export const focusIndex = async (state, index) => {
  if (index === state.activeIndex) {
    return state
  }
  const oldActiveIndex = state.activeIndex
  state.activeIndex = index

  const editor = state.editors[index]
  const x = state.x
  const y = state.y + state.tabHeight
  const width = state.width
  const height = state.height - state.tabHeight
  const id = ViewletMap.getModuleId(editor.uri)

  const oldEditor = state.editors[oldActiveIndex]
  const oldId = ViewletMap.getModuleId(oldEditor.uri)
  const oldInstance = ViewletStates.getInstance(oldId)

  const instanceUid = Id.create()
  const instance = ViewletManager.create(ViewletModule.load, id, ViewletModuleId.Main, editor.uri, x, y, width, height)
  instance.show = false
  instance.setBounds = false
  instance.uid = instanceUid

  // TODO race condition
  RendererProcess.invoke(
    /* Viewlet.send */ 'Viewlet.send',
    /* id */ state.uid,
    /* method */ 'focusAnotherTab',
    /* unFocusIndex */ oldActiveIndex,
    /* focusIndex */ state.activeIndex
  )

  if (BackgroundTabs.has(editor.uri)) {
    console.log('has background true')
    const props = BackgroundTabs.get(editor.uri)
    // @ts-ignore
    const commands = await ViewletManager.load(instance, false, false, props)
    commands.push(['Viewlet.appendViewlet', state.uid, instanceUid])
    await RendererProcess.invoke('Viewlet.sendMultiple', commands)
  } else {
    console.log('has background false')
    // @ts-ignore
    const commands = await ViewletManager.load(instance)
    commands.push(['Viewlet.appendViewlet', state.uid, instanceUid])
    console.log({ commands })
    await RendererProcess.invoke('Viewlet.sendMultiple', commands)
  }

  if (oldInstance && oldInstance.factory.hide) {
    await oldInstance.factory.hide(oldInstance.state)
    BackgroundTabs.add(oldInstance.state.uri, oldInstance.state)
  }
  return state
}

export const focusFirst = (state) => {
  return focusIndex(state, 0)
}

export const focusLast = (state) => {
  return focusIndex(state, state.editors.length - 1)
}

export const focusPrevious = (state) => {
  const previousIndex = state.activeIndex === 0 ? state.editors.length - 1 : state.activeIndex - 1
  return focusIndex(state, previousIndex)
}

export const focusNext = (state) => {
  const nextIndex = state.activeIndex === state.editors.length - 1 ? 0 : state.activeIndex + 1
  return focusIndex(state, nextIndex)
}

export const handleTabClick = (state, button, index) => {
  switch (button) {
    case MouseEventType.LeftClick:
      return focusIndex(state, index)
    case MouseEventType.MiddleClick:
      return closeEditor(state, index)
    default:
      return state
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

export const closeOthers = async (state) => {
  if (state.focusedIndex === state.activeIndex) {
    // view is kept the same, only tabs are closed
    await RendererProcess.invoke(
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ state.uid,
      /* method */ 'closeOthers',
      /* keepIndex */ state.focusedIndex,
      /* focusIndex */ state.focusedIndex
    )
  } else {
    // view needs to be switched to focused index
    await RendererProcess.invoke(
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ state.uid,
      /* method */ 'closeOthers',
      /* keepIndex */ state.focusedIndex,
      /* focusIndex */ state.focusedIndex
    )
  }
  state.editors = [state.editors[state.focusedIndex]]
  state.activeIndex = 0
  state.focusedIndex = 0
}

export const closeTabsRight = async (state) => {
  if (state.focusedIndex >= state.activeIndex) {
    // view is kept the same, only tabs are closed
    await RendererProcess.invoke(/* Viewlet.send */ 'Viewlet.send', /* id */ state.uid, /* method */ 'closeTabsRight', /* index */ state.focusedIndex)
  } else {
    // view needs to be switched to focused index
    await RendererProcess.invoke(/* Viewlet.send */ 'Viewlet.send', /* id */ state.uid, /* method */ 'closeTabsRight', /* index */ state.focusedIndex)
  }
  state.editors = state.editors.slice(0, state.focusedIndex + 1)
  state.activeIndex = state.focusedIndex
}

export const closeTabsLeft = async (state) => {
  if (state.focusedIndex <= state.activeIndex) {
    // view is kept the same, only tabs are closed
    await RendererProcess.invoke(/* Viewlet.send */ 'Viewlet.send', /* id */ state.uid, /* method */ 'closeTabsLeft', /* index */ state.focusedIndex)
  } else {
    // view needs to be switched to focused index
    await RendererProcess.invoke(/* Viewlet.send */ 'Viewlet.send', /* id */ state.uid, /* method */ 'closeTabsLeft', /* index */ state.focusedIndex)
  }
  state.editors = state.editors.slice(state.focusedIndex)
  state.activeIndex = state.focusedIndex
}

export const resize = (state, dimensions) => {
  const { editors } = state
  const x = dimensions.x
  const y = dimensions.y + state.tabHeight
  const width = dimensions.width
  const height = dimensions.height - state.tabHeight
  const childDimensions = {
    x,
    y,
    width,
    height,
  }
  const editor = editors[0]
  let commands = []
  if (editor) {
    const editorUid = editor.uid
    Assert.number(editorUid)
    commands = Viewlet.resize(editorUid, childDimensions)
  }
  return {
    newState: {
      ...state,
      ...dimensions,
    },
    commands,
  }
}

export const hasFunctionalRender = true

export const render = []
