import * as GetE2eTestsSandbox from '../GetE2eTestsSandbox/GetE2eTestsSandbox.ts'
import * as Id from '../Id/Id.js'
import * as Transferrable from '../Transferrable/Transferrable.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import type { E2eTestState } from './ViewletE2eTestTypes.ts'

export const create = (id, uri, x, y, width, height): E2eTestState => {
  return {
    x,
    y,
    width,
    height,
    name: '',
    index: -1,
    iframeSrc: '',
    iframeOrigin: '',
    iframeSandbox: [],
    portId: -1,
    uri,
    content: '',
    previewTransform: '',
  }
}

export const loadContent = async (state: E2eTestState): Promise<E2eTestState> => {
  const sandbox = GetE2eTestsSandbox.getE2eTestsSandbox()
  const root = await SharedProcess.invoke('Platform.getRoot')
  const testPath = await SharedProcess.invoke('Platform.getTestPath')
  const absolutePath = `${root}/${testPath}/src`
  const fileName = state.uri.slice('e2e-test://'.length)
  const filePath = `${absolutePath}/${fileName}`
  const content = await FileSystem.readFile(filePath)
  const htmlFileName = fileName.replace('.js', '.html')
  const iframeSrc = `http://localhost:3001/tests/${htmlFileName}`
  const previewTransform = `scale(0.6)`
  return {
    ...state,
    name: '',
    iframeSandbox: sandbox,
    iframeSrc,
    content,
    previewTransform,
  }
}

export const executeTest = async (state: E2eTestState): Promise<E2eTestState> => {
  return {
    ...state,
  }
}

export const handleLoad = async (state: E2eTestState): Promise<E2eTestState> => {
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

export const handleClickAt = async (state: E2eTestState, eventX: number, eventY: number): Promise<E2eTestState> => {
  console.log('click', eventX, eventY)
  return state
}
