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

const SanitizeHtml = await import('../src/parts/SanitizeHtml/SanitizeHtml.js')
const RendererProcess = await import(
  '../src/parts/RendererProcess/RendererProcess.js'
)

test('sanitzeHtml', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {
    return '<h1>hello world</h1>'
  })
  expect(
    await SanitizeHtml.sanitizeHtml(
      '<h1>hello world<script>alert(1)</script></h1>'
    )
  ).toBe(`<h1>hello world</h1>`)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'SanitizeHtml.sanitizeHtml',
    '<h1>hello world<script>alert(1)</script></h1>'
  )
})
