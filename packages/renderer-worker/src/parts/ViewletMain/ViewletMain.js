import * as Arrays from '../Arrays/Arrays.js'
import * as Assert from '../Assert/Assert.js'
import * as Command from '../Command/Command.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as LifeCycle from '../LifeCycle/LifeCycle.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'
import * as ViewletMap from '../ViewletMap/ViewletMap.js'
import * as ViewletModule from '../ViewletModule/ViewletModule.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as Workspace from '../Workspace/Workspace.js'

const canBeRestored = (editor) => {
  return FileSystem.canBeRestored(editor.uri)
}

const getMainEditors = (state) => {
  if (state && state.editors) {
    // TODO check that type is string (else runtime error occurs and page is blank)
    return state.editors.filter(canBeRestored).slice(-1)
  }
  return []
}

const restoreEditors = async (state) => {
  // // TODO have mapping that loads custom editor module on demand
  // // file:// -> import text editor
  // // perf://startup-performance -> show startup performance
  // // perf://memory-usage -> show memory usage
  // // svg://my-file.svg -> show svg
  // // image://my-image.png -> show image
  // // video://my-video.png -> show video
  // // also editor title can be shown while content is still loading
  // if (restoredEditor.uri.startsWith('perf://')) {
  //   Command.execute(/* Developer.openPerf */ 820)
  //   return
  // }
  // @ts-ignore
  await openUri(state, restoredEditor.uri)
}

const handleTokenizeChange = (languageId) => {
  // @ts-ignore

  const instances = ViewletState.getAllInstances()
  if (instances.EditorText) {
    const instance = instances.EditorText
  }
  // for (const editor of state.editors) {
  //   if (editor.languageId === languageId) {
  //     Editor.handleTokenizeChange(editor)
  //   }
  // }
}

export const name = ViewletModuleId.Main

export const create = (id, uri, left, top, width, height) => {
  return {
    editors: [],
    activeIndex: -1,
    focusedIndex: -1,
    left,
    top,
    width,
    height,
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

const TAB_HEIGHT = 35

const getRestoredEditors = (savedState) => {
  if (Workspace.isTest()) {
    return []
  }
  const restoredEditors = getMainEditors(savedState)
  return restoredEditors
}

export const loadContent = (state, savedState) => {
  console.log({ savedState })
  // TODO get restored editors from saved state
  const editors = getRestoredEditors(savedState)
  return {
    ...state,
    editors,
  }
}

export const getChildren = (state) => {
  const { editors } = state
  if (editors.length === 0) {
    return []
  }
  const editor = editors[0]
  console.log({ editor })
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
  const top = state.top + TAB_HEIGHT
  const left = state.left
  const width = state.width
  const height = state.height - TAB_HEIGHT
  const id = ViewletMap.getId(editor.uri)
  const tabLabel = Workspace.pathBaseName(editor.uri)
  const tabTitle = getTabTitle(editor.uri)
  const commands = [
    [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'Main',
      /* method */ 'openViewlet',
      /* tabLabel */ tabLabel,
      /* tabTitle */ tabTitle,
    ],
  ]

  // // TODO race condition: Viewlet may have been resized before it has loaded
  // // @ts-ignore
  const extraCommands = await ViewletManager.load(
    {
      getModule: ViewletModule.load,
      id,
      // @ts-ignore
      parentId: 'Main',
      uri: editor.uri,
      left,
      top,
      width,
      height,
      show: false,
      focus: false,
      type: 0,
      setBounds: false,
    },
    /* focus */ false,
    /* restore */ true
  )
  commands.push(...extraCommands)
  commands.push(['Viewlet.appendViewlet', 'Main', id])
  return commands
}

export const openUri = async (state, uri, focus = true) => {
  Assert.object(state)
  Assert.string(uri)
  const top = state.top + TAB_HEIGHT
  const left = state.left
  const width = state.width
  const height = state.height - TAB_HEIGHT
  const id = ViewletMap.getId(uri)

  for (const editor of state.editors) {
    if (editor.uri === uri) {
      // TODO if the editor is already open, nothing needs to be done
      const extraCommands = await ViewletManager.load(
        {
          getModule: ViewletModule.load,
          id,
          // @ts-ignore
          parentId: 'Main',
          type: 0,
          uri,
          left,
          top,
          width,
          height,
          show: false,
          focus: false,
        },
        focus
      )
      return {
        newState: state,
        commands: extraCommands,
      }
    }
  }
  const commands = []
  if (state.editors.length > 0) {
    const id = getId(state.editors[0])
    const extraCommands = Viewlet.disposeFunctional(id)
    commands.push(...extraCommands)
    // TODO dispose current editor
  }
  const oldActiveIndex = state.activeIndex
  state.editors.push({ uri })
  state.activeIndex = state.editors.length - 1
  const tabLabel = Workspace.pathBaseName(uri)
  const tabTitle = getTabTitle(uri)
  commands.push([
    /* Viewlet.send */ 'Viewlet.send',
    /* id */ 'Main',
    /* method */ 'openViewlet',
    /* tabLabel */ tabLabel,
    /* tabTitle */ tabTitle,
    /* oldActiveIndex */ oldActiveIndex,
  ])
  // @ts-ignore
  const extraCommands = await ViewletManager.load(
    {
      getModule: ViewletModule.load,
      id,
      // @ts-ignore
      parentId: 'Main',
      type: 0,
      uri,
      left,
      top,
      width,
      height,
      show: false,
      focus: false,
    },
    focus
  )
  console.log({ extraCommands })
  commands.push(...extraCommands)
  commands.push(['Viewlet.appendViewlet', 'Main', id])
  console.log({ commands })
  return {
    newState: state,
    commands: extraCommands,
  }
}

export const save = (state) => {
  // TODO handle different types of editors / custom editors / webviews
  Command.execute(/* EditorSave.editorSave */ 'Editor.save')
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

export const handleDrop = async () => {
  console.log(['main drop'])
  const clipBoardText = await SharedProcess.invoke(
    /* ClipBoard.read */ 'ClipBoard.read'
  )
  console.log({ clipBoardText })
}

const getId = (editor) => {
  return ViewletMap.getId(editor.uri)
}

export const dispose = () => {}

export const handleTabContextMenu = async (state, index, x, y) => {
  state.focusedIndex = index
  await Command.execute(
    /* ContextMenu.show */ 'ContextMenu.show',
    /* x */ x,
    /* y */ y,
    /* id */ MenuEntryId.Tab
  )
}

export const stateUpdated = (oldState, newState) => {
  // TODO create/update editors
}

export const resize = (state, dimensions) => {
  const { editors } = state
  const top = dimensions.top + TAB_HEIGHT
  const left = dimensions.left
  const width = dimensions.width
  const height = dimensions.height - TAB_HEIGHT
  const childDimensions = {
    top,
    left,
    width,
    height,
  }
  const editor = editors[0]
  let commands = []
  if (editor) {
    const id = ViewletMap.getId(editor.uri)
    commands = Viewlet.resize(id, childDimensions)
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
