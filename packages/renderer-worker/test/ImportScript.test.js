import * as ImportScript from '../src/parts/ImportScript/ImportScript.js'

test('importScript - error - cannot find module', async () => {
  await expect(ImportScript.importScript('test://file.js')).rejects.toThrowError(
    new Error("Failed to import test://file.js: Error: Cannot find module 'test://file.js' from 'src/parts/ImportScript/ImportScript.js'")
  )
})

// TODO not sure how this can be tested
test.skip('importScript - error - 404', async () => {
  await expect(ImportScript.importScript('https://example.com/file.js')).rejects.toThrowError(
    new Error("Failed to import test://file.js: Error: Cannot find module 'test://file.js' from 'src/parts/ImportScript/ImportScript.js'")
  )
})
