import { beforeEach, expect, jest, test } from '@jest/globals'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/ElectronWindowAbout/ElectronWindowAbout.js', () => {
  return {
    open: jest.fn(),
  }
})

jest.unstable_mockModule('../src/parts/Viewlet/Viewlet.js', () => {
  return {
    openWidget: jest.fn(),
  }
})

test('showAbout - electron', async () => {
  jest.resetModules()
  jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
    return {
      platform: PlatformType.Electron,
      getPlatform: () => {
        return PlatformType.Electron
      },
    }
  })
  const About = await import('../src/parts/About/About.js')
  const ElectronWindowAbout = await import('../src/parts/ElectronWindowAbout/ElectronWindowAbout.js')
  const Viewlet = await import('../src/parts/Viewlet/Viewlet.js')
  await About.showAbout()
  expect(ElectronWindowAbout.open).toHaveBeenCalledTimes(1)
  expect(Viewlet.openWidget).not.toHaveBeenCalled()
})

test('showAbout - web', async () => {
  jest.resetModules()
  jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
    return {
      platform: PlatformType.Web,
      getPlatform: () => {
        return PlatformType.Web
      },
    }
  })
  const About = await import('../src/parts/About/About.js')
  const ElectronWindowAbout = await import('../src/parts/ElectronWindowAbout/ElectronWindowAbout.js')
  const Viewlet = await import('../src/parts/Viewlet/Viewlet.js')
  await About.showAbout()
  expect(ElectronWindowAbout.open).not.toHaveBeenCalled()
  expect(Viewlet.openWidget).toHaveBeenCalledTimes(1)
  expect(Viewlet.openWidget).toHaveBeenCalledWith('About')
})
