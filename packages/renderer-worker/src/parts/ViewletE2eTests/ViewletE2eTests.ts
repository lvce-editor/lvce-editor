import * as ContextMenu from '../ContextMenu/ContextMenu.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as GetE2eTestsSandbox from '../GetE2eTestsSandbox/GetE2eTestsSandbox.ts'
import * as Id from '../Id/Id.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import * as Open from '../Open/Open.js'
import * as OpenUri from '../OpenUri/OpenUri.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as Transferrable from '../Transferrable/Transferrable.js'
import type { E2eState } from './ViewletE2eTestsTypes.ts'

export const create = (id, uri, x, y, width, height): E2eState => {
  return {
    x,
    y,
    width,
    height,
    tests: [],
    index: -1,
    iframeSrc: '',
    iframeOrigin: '',
    sandbox: [],
    portId: -1,
  }
}

const getTests = async () => {
  const root = await SharedProcess.invoke('Platform.getRoot')
  const testPath = await SharedProcess.invoke('Platform.getTestPath')
  const absolutePath = `${root}/${testPath}/src`
  const dirents = await FileSystem.readDirWithFileTypes(absolutePath)
  const filteredDirents = dirents.slice(1)
  console.log({ filteredDirents })
  const tests = filteredDirents.map((dirent) => dirent.name)
  return tests
}

export const loadContent = async (state: E2eState): Promise<E2eState> => {
  const tests = await getTests()
  const sandbox = GetE2eTestsSandbox.getE2eTestsSandbox()

  return {
    ...state,
    tests,
    sandbox,
  }
}

export const executeTest = async (state: E2eState, index: number): Promise<E2eState> => {
  const { tests } = state
  const test = tests[index]
  const htmlFileName = test.replace('.js', '.html')
  const iframeSrc = `http://localhost:3001/tests/${htmlFileName}`
  return {
    ...state,
    index,
    iframeSrc,
  }
}

export const handleLoad = async (state: E2eState): Promise<E2eState> => {
  const messagePortId = Id.create()
  const { port1, port2 } = new MessageChannel()
  await Transferrable.transferToRendererProcess(messagePortId, port1)
  port2.onmessage = (event) => {
    console.log({ event })
  }
  const iframeOrigin = 'http://localhost:3001'
  return {
    ...state,
    portId: messagePortId,
    iframeOrigin,
  }
}

const getIndex = (stateY: number, eventY: number) => {
  const rowHeight = 22
  const index = Math.floor((eventY - stateY) / rowHeight)
  return index
}

export const handleClickAt = async (state: E2eState, eventX: number, eventY: number): Promise<E2eState> => {
  console.log('click', eventX, eventY)
  const index = getIndex(state.y, eventY)
  const item = state.tests[index]
  const url = `e2e-test://${item}`
  await OpenUri.openUri(url)
  return state
}

export const runAll = (state: E2eState): E2eState => {
  console.log('run all')
  return state
}

export const handleContextMenu = async (state: E2eState, button, x, y): Promise<E2eState> => {
  const index = getIndex(state.y, y)
  // @ts-ignore
  state.index = index
  await ContextMenu.show(x, y, MenuEntryId.E2eTests)
  return state
}

export const openInNewTab = async (state: E2eState): Promise<E2eState> => {
  const { index, tests } = state
  const item = tests[index]
  const url = '/tests/' + item.replace('.js', '.html')
  await Open.openUrl(url)
  return state
}
