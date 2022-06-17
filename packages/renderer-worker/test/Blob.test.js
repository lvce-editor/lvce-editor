/**
 * @jest-environment jsdom
 */
import * as Blob from '../src/parts/Blob/Blob.js'

test('base64StringToBlob', async () => {
  expect(await Blob.base64StringToBlob('YWJj')).toBeInstanceOf(self.Blob)
})
