import { afterEach, beforeEach, expect, jest, test } from '@jest/globals'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const inject = jest.fn<(html: unknown, config: unknown) => Promise<string>>()
jest.unstable_mockModule('../src/parts/AddCustomPathsToIndexHtml/AddCustomPathsToIndexHtml.ts', () => ({ addCustomPathsToIndexHtml: inject }))
const { getElectronFileResponseContent } = await import('../src/parts/GetElectronFileResponseContent/GetElectronFileResponseContent.ts')
let directory: string
let path: string
beforeEach(async () => {
  directory = await mkdtemp(join(tmpdir(), 'lvce-index-content-'))
  path = join(directory, 'index.html')
  await writeFile(path, '<html>app</html>')
  inject.mockReset().mockResolvedValue('<html>electron</html>')
})
afterEach(async () => {
  await rm(directory, { force: true, recursive: true })
})

test.each([
  ['lvce-oss://-/', undefined],
  ['lvce-oss://-/?workspace=file%3A%2F%2F%2Fworkspace', 'file:///workspace'],
  ['lvce-oss://-/?editorTransfer=token', undefined],
  ['/', undefined],
])('injects Electron configuration for the app index %s', async (url, workspaceUri) => {
  expect(await getElectronFileResponseContent({}, path, url)).toEqual(Buffer.from('<html>electron</html>'))
  expect(inject).toHaveBeenCalledWith('<html>app</html>', { platform: 'electron', workspaceUri })
})

test('does not inject app configuration into non-index content', async () => {
  expect(await getElectronFileResponseContent({}, path, 'lvce-oss://-/preview.html?editorTransfer=token')).toEqual(Buffer.from('<html>app</html>'))
  expect(inject).not.toHaveBeenCalled()
})
