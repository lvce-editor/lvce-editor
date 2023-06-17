import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/SourceControl/SourceControl.js', () => {
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
    getEnabledProviderIds() {
      return ['test']
    },
    getGroups() {
      return []
    },
  }
})

const ViewletSourceControl = await import('../src/parts/ViewletSourceControl/ViewletSourceControl.js')
const ViewletSourceControlAcceptInput = await import('../src/parts/ViewletSourceControl/ViewletSourceControlAcceptInput.js')
const SourceControl = await import('../src/parts/SourceControl/SourceControl.js')

test('acceptInput', async () => {
  // @ts-ignore
  SourceControl.acceptInput.mockImplementation(() => {})
  const state = { ...ViewletSourceControl.create(), enabledProviderIds: ['test'] }
  expect(await ViewletSourceControlAcceptInput.acceptInput(state)).toMatchObject({
    inputValue: '',
  })
})
