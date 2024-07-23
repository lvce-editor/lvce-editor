import type { E2eState } from './ViewletE2eTestsTypes.ts'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as FileSystem from '../FileSystem/FileSystem.js'

export const create = (id, uri, x, y, width, height): E2eState => {
  return {
    x,
    y,
    width,
    height,
    tests: [],
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
  return {
    ...state,
    tests,
  }
}

export const executeTest = async (state: E2eState, index: number): Promise<E2eState> => {
  const { tests } = state
  const test = tests[index]
  console.log({ test })
  // const result = await SharedProcess.invoke('E2eTests.execute', test)
  // console.log({ result })
  return state
}

export const handleClickAt = (state: E2eState, eventX: number, eventY: number): Promise<E2eState> => {
  console.log('click', eventX, eventY)
  const rowHeight = 22
  const index = Math.floor((eventY - state.y) / rowHeight)
  return executeTest(state, index)
}
