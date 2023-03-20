import { jest } from '@jest/globals'
import * as ViewletModuleId from '../src/parts/ViewletModuleId/ViewletModuleId.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/ExtensionHost/ExtensionHostSourceControl.js', () => {
  return {
    acceptInput: jest.fn(() => {
      throw new Error('not implemented')
    }),
    getChangedFiles: jest.fn(() => {
      throw new Error('not implemented')
    }),
    getFileBefore: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const ViewletSourceControl = await import('../src/parts/ViewletSourceControl/ViewletSourceControl.js')
const ViewletSourceControlAcceptInput = await import('../src/parts/ViewletSourceControl/ViewletSourceControlAcceptInput.js')

const ExtensionHostSourceControl = await import('../src/parts/ExtensionHost/ExtensionHostSourceControl.js')

const ViewletManager = await import('../src/parts/ViewletManager/ViewletManager.js')

const render = (oldState, newState) => {
  return ViewletManager.render(ViewletSourceControl, oldState, newState, ViewletModuleId.SourceControl)
}

test('acceptInput', async () => {
  // @ts-ignore
  ExtensionHostSourceControl.acceptInput.mockImplementation(() => {})
  const state = ViewletSourceControl.create()
  expect(await ViewletSourceControlAcceptInput.acceptInput(state, 'abc')).toMatchObject({
    inputValue: '',
  })
})
