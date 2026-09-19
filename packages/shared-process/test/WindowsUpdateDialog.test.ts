import { afterAll, expect, jest, test } from '@jest/globals'

const showMessageBox = jest.fn<(...args: any[]) => Promise<number | undefined>>()
jest.unstable_mockModule('../src/parts/ElectronDialog/ElectronDialog.ts', () => ({ showMessageBox }))
const { check } = await import('../src/parts/WindowsStagedUpdate/WindowsStagedUpdate.ts')
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
        assets: [{ name: `Lvce-Stage-v1.2.3-${process.arch}.json` }, { name: `Lvce-Setup-v1.2.3-${process.arch}.exe` }],
        tag_name: 'v1.2.3',
      }),
    )
  }) as typeof fetch
  showMessageBox.mockResolvedValueOnce(answer)
  await expect(check(false, 42)).resolves.toBe(true)
  expect(requests).toEqual(['https://api.github.com/repos/lvce-editor/lvce-editor/releases/latest'])
  expect(showMessageBox).toHaveBeenLastCalledWith(expect.objectContaining({ buttons: ['Prepare Update', 'Cancel'], windowId: 42 }))
})
