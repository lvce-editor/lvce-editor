import * as FileSystem from '../FileSystem/FileSystem.js'
import * as GetE2eTestsSandbox from '../GetE2eTestsSandbox/GetE2eTestsSandbox.ts'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
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
    sandbox: [],
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
  console.log({ iframeSrc })
  return {
    ...state,
    index,
    iframeSrc,
  }
}

export const handleClickAt = (state: E2eState, eventX: number, eventY: number): Promise<E2eState> => {
  console.log('click', eventX, eventY)
  const rowHeight = 22
  const index = Math.floor((eventY - state.y) / rowHeight)
  return executeTest(state, index)
}
