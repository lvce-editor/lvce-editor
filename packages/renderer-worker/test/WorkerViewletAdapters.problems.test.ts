import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/GetActiveEditor/GetActiveEditor.js', () => ({
  getActiveUri: jest.fn(async () => 'memfs:///preview/example.txt'),
}))
const GetActiveEditor = await import('../src/parts/GetActiveEditor/GetActiveEditor.js')
const WorkerViewletAdapters = await import('../src/parts/WorkerViewletAdapters/WorkerViewletAdapters.js')

beforeEach(() => jest.clearAllMocks())

test('initializes embedded Problems with its application active URI before rendering', async () => {
  const invoke = jest.fn(async () => {})
  await WorkerViewletAdapters.problems.afterLoadContent({ context: { applicationId: 'preview' }, state: { uid: 7 }, worker: { invoke } })
  expect(GetActiveEditor.getActiveUri).toHaveBeenCalledWith('preview')
  expect(invoke).toHaveBeenCalledWith('Problems.handleActiveEditorChange', 7, 'memfs:///preview/example.txt')
})

test('normal workbench Problems keeps its existing active-editor initialization', async () => {
  const invoke = jest.fn(async () => {})
  await WorkerViewletAdapters.problems.afterLoadContent({ context: {}, state: { uid: 7 }, worker: { invoke } })
  expect(GetActiveEditor.getActiveUri).not.toHaveBeenCalled()
  expect(invoke).not.toHaveBeenCalled()
})
