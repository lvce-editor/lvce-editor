import { afterAll, expect, jest, test } from '@jest/globals'

const showMessageBox = jest.fn<(...args: any[]) => Promise<number | undefined>>()
jest.unstable_mockModule('../src/parts/ElectronDialog/ElectronDialog.ts', () => ({ showMessageBox }))
const { check, supportsStagedUpdate } = await import('../src/parts/WindowsStagedUpdate/WindowsStagedUpdate.ts')
const originalFetch = globalThis.fetch
afterAll(() => {
  globalThis.fetch = originalFetch
})

test.each([1, undefined])('cancel/dismiss response %s never starts preparing an update', async (answer) => {
  const requests: string[] = []
  globalThis.fetch = (async (url: any) => {
    requests.push(String(url))
    return new Response(
      JSON.stringify({
        assets: [{ name: `Lvce-Setup-v1.2.3-${process.arch}.exe` }],
        tag_name: 'v1.2.3',
      }),
    )
  }) as typeof fetch
  showMessageBox.mockResolvedValueOnce(answer)
  await expect(check(false, 42)).resolves.toBe(true)
  expect(requests).toEqual(['https://api.github.com/repos/lvce-editor/lvce-editor/releases/latest'])
  expect(showMessageBox).toHaveBeenLastCalledWith(expect.objectContaining({ buttons: ['Prepare Update', 'Cancel'], windowId: 42 }))
})

test('staged update support starts with the first release using the v2 startup protocol', () => {
  expect(supportsStagedUpdate('0.116.1')).toBe(false)
  expect(supportsStagedUpdate('0.116.2')).toBe(true)
  expect(supportsStagedUpdate('0.118.19')).toBe(true)
})

test('releases older than the v2 staging protocol fall back to the normal installer', async () => {
  showMessageBox.mockClear()
  globalThis.fetch = async (): Promise<Response> =>
    new Response(
      JSON.stringify({
        assets: [{ name: `Lvce-Setup-v0.116.1-${process.arch}.exe` }],
        tag_name: 'v0.116.1',
      }),
    )
  await expect(check(false, 42)).resolves.toBe(false)
  expect(showMessageBox).not.toHaveBeenCalled()
})

test.each([
  ['missing installer', []],
  ['wrong architecture installer', [{ name: `Lvce-Setup-v1.2.3-${process.arch === 'x64' ? 'arm64' : 'x64'}.exe` }]],
])('%s falls back to the normal installer', async (_name, assets) => {
  showMessageBox.mockClear()
  globalThis.fetch = async (): Promise<Response> => new Response(JSON.stringify({ assets, tag_name: 'v1.2.3' }))
  await expect(check(false, 42)).resolves.toBe(false)
  expect(showMessageBox).not.toHaveBeenCalled()
})
