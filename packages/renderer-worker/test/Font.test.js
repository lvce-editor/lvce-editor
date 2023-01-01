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
