import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/ExportStatic/ExportStatic.js', () => ({
  exportStatic: jest.fn(),
}))

const SharedProcess = await import('../index.js')
const ExportStatic = await import('../src/parts/ExportStatic/ExportStatic.js')

beforeEach(() => {
  // @ts-ignore
  ExportStatic.exportStatic.mockReset()
  // @ts-ignore
  ExportStatic.exportStatic.mockResolvedValue({
    commitHash: 'test-commit',
  })
  delete process.env.PATH_PREFIX
})

test('exportStatic forwards multiple extension paths', async () => {
  await SharedProcess.exportStatic({
    root: '/test/root',
    extensionPaths: ['packages/extension-a', 'packages/extension-b'],
  })

  // @ts-ignore
  const [options] = ExportStatic.exportStatic.mock.calls[0]
  expect(options).toEqual({
    root: '/test/root',
    pathPrefix: '',
    extensionPath: undefined,
    extensionPaths: ['/test/root/packages/extension-a', '/test/root/packages/extension-b'],
    testPath: '',
  })
})
