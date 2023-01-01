import * as Font from '../src/parts/Font/Font.js'

test('load - error', async () => {
  // @ts-ignore
  globalThis.fonts = {
    load() {
      throw new TypeError('x is not a function')
    },
  }
  await expect(Font.load(10, 'Test Font')).rejects.toThrowError(new Error(`Failed to load font Test Font: TypeError: x is not a function`))
})

test('load - error - dom exception - chrome', async () => {
  // @ts-ignore
  globalThis.fonts = {
    load() {
      throw new DOMException(`Could not resolve 'Test Font' as a font.`, 'SyntaxError')
    },
  }
  await expect(Font.load(10, 'Test Font')).rejects.toThrowError(
    new Error(`Failed to load font Test Font: DOMException: Could not resolve 'Test Font' as a font.`)
  )
})

test('load - error - dom exception - firefox', async () => {
  // @ts-ignore
  globalThis.fonts = {
    load() {
      throw new DOMException(`FontFaceSet.load: Invalid font shorthand`, 'SyntaxError')
    },
  }
  await expect(Font.load(10, 'Test Font')).rejects.toThrowError(
    new Error('Failed to load font Test Font: DOMException: FontFaceSet.load: Invalid font shorthand')
  )
})
