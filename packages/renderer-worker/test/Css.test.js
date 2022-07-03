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

const Css = await import('../src/parts/Css/Css.js')

test('setInlineStyle', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await Css.setInlineStyle('test', '* { height: 500px; }')
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Css.setInlineStyle',
    'test',
    '* { height: 500px; }'
  )
})
