import { jest } from '@jest/globals'

beforeAll(() => {
  // @ts-ignore
  globalThis.Response = class {
    constructor(input) {
      this.ok = input.ok
      this._text = input.text
      this.statusText = input.statusText
    }
    text() {
      return this._text
    }
  }
})

beforeEach(() => {
  jest.resetAllMocks()
  globalThis.fetch = async () => {
    throw new Error('not implemented')
  }
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

test('loadCssStyleSheet - error - 404', async () => {
  // @ts-ignore
  globalThis.fetch = () => {
    // @ts-ignore
    return new Response({ ok: false, statusText: 'Not Found' })
  }
  await expect(
    Css.loadCssStyleSheet('/test/Component.css')
  ).rejects.toThrowError(
    new Error('Failed to load css /test/Component.css: Error: Not Found')
  )
})

test('loadCssStyleSheet', async () => {
  // @ts-ignore
  globalThis.fetch = async () => {
    return new Response({
      ok: true,
      statusText: 'ok',
      // @ts-ignore
      text: 'h1 { font-size: 20px; }',
    })
  }
  await Css.loadCssStyleSheet('/test/Component.css')
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Css.addCssStyleSheet',
    'h1 { font-size: 20px; }'
  )
})
