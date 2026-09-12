import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts', () => ({
  getConfiguredWorkerUrl: (key: string) => (key === 'develop.explorerWorkerPath' ? '/custom/explorer.js' : ''),
}))

const { getName, registerViewlet, registerWorker } = await import('../src/parts/ComponentWorkerNames/ComponentWorkerNames.js')

test('resolves the actual launch name through factory identity, including configured paths', () => {
  const factory = { create: () => {} }
  registerViewlet(factory.create, 'explorer')
  expect(() => getName(factory, 'Explorer')).toThrow('Component worker not found: explorer')
  registerWorker('/custom/explorer.js', 'Custom Explorer')
  expect(getName(factory, 'Explorer')).toBe('Custom Explorer')
  registerWorker('/packages/explorerViewWorkerMain.js', 'Explorer Worker')
  expect(getName(factory, 'Explorer')).toBe('Explorer Worker')
})

test('ignores transports without worker names and leaves renderer components unassigned', () => {
  registerWorker(undefined, undefined)
  registerWorker('/unknown.js', 'Other Worker')
  expect(getName({}, 'Layout')).toBeUndefined()
})

test('tracks the editor worker separately from renderer-owned components', () => {
  registerWorker('/editorWorkerMain.js', 'Editor Worker')
  expect(getName({}, 'Editor')).toBe('Editor Worker')
})
