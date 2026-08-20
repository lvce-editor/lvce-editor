import { expect, jest, test } from '@jest/globals'

const invoke = jest.fn<(...args: readonly any[]) => Promise<any>>()

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => ({
  invoke,
}))

const DropData = await import('../src/parts/DropData/DropData.js')

test('forwards requested drop formats to the renderer process', async () => {
  const options = { formats: ['string'], includeElectronFilePaths: false }
  invoke.mockResolvedValue([{ index: 0, kind: 'string', type: 'text/plain', value: 'hello' }])

  await expect(DropData.get(7, options)).resolves.toEqual([{ index: 0, kind: 'string', type: 'text/plain', value: 'hello' }])
  expect(invoke).toHaveBeenCalledWith('DropData.get', 7, options)
})
