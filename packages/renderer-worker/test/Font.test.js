import * as Font from '../src/parts/Font/Font.js'

test('load - error', async () => {
  // @ts-ignore
  globalThis.fonts = {}
  // @ts-ignore
  globalThis.FontFace = class {
    load() {
      throw new TypeError('x is not a function')
    }
  }
  await expect(Font.load('Test Font', `url('test://test-font')`)).rejects.toThrowError(
    new Error(`Failed to load font Test Font: TypeError: x is not a function`)
  )
})

test('load - error - dom exception - chrome', async () => {
  // @ts-ignore
  globalThis.fonts = {}
  // @ts-ignore
  globalThis.FontFace = class {
    load() {
      throw new DOMException(`Could not resolve 'Test Font' as a font.`, 'SyntaxError')
    }
  }
  await expect(Font.load('Test Font', `url('test://test-font')`)).rejects.toThrowError(
    new Error(`Failed to load font Test Font: DOMException: Could not resolve 'Test Font' as a font.`)
  )
})

test('load - error - dom exception - firefox', async () => {
  // @ts-ignore
  globalThis.fonts = {}
  // @ts-ignore
  globalThis.FontFace = class {
    load() {
      throw new DOMException(`FontFaceSet.load: Invalid font shorthand`, 'SyntaxError')
    }
  }
  await expect(Font.load('Test Font', `url('test://test-font')`)).rejects.toThrowError(
    new Error('Failed to load font Test Font: DOMException: FontFaceSet.load: Invalid font shorthand')
  )
})

test('load - content security policy error - chrome', async () => {
  // @ts-ignore
  globalThis.fonts = {}
  // @ts-ignore
  globalThis.FontFace = class {
    load() {
      throw new DOMException(`A network error occurred.`, 'NetworkError')
    }
  }
  await expect(Font.load('Test Font', `url('test://test-font')`)).rejects.toThrowError(
    new Error(`Failed to load font Test Font: DOMException: A network error occurred.`)
  )
})
