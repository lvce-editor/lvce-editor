import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/RendererProcess/RendererProcess.js',
  () => {
    return {
      invoke: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)
const RendererProcess = await import(
  '../src/parts/RendererProcess/RendererProcess.js'
)

const Meta = await import('../src/parts/Meta/Meta.js')

test('setThemeColor', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await Meta.setThemeColor('lightgreen')
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Meta.setThemeColor',
    'lightgreen'
  )
})
