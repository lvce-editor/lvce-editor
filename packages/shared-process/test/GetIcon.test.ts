import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/IsLinux/IsLinux.js', () => ({
  isLinux: true,
}))

jest.unstable_mockModule('../src/parts/IsProduction/IsProduction.js', () => ({
  isProduction: true,
}))

jest.unstable_mockModule('../src/parts/IsWindows/IsWindows.js', () => ({
  isWindows: false,
}))

jest.unstable_mockModule('../src/parts/Root/Root.js', () => ({
  root: '/test/root',
}))

const GetIcon = await import('../src/parts/GetIcon/GetIcon.js')

test('getIcon - production linux', () => {
  expect(GetIcon.getIcon().replaceAll('\\', '/')).toBe('/test/root/static/icons/icon.png')
})
