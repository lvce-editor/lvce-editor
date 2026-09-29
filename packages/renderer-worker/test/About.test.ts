import { beforeEach, expect, jest, test } from '@jest/globals'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/AboutViewWorker/AboutViewWorker.js', () => {
  return {
    invoke: jest.fn(),
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
  const AboutViewWorker = await import('../src/parts/AboutViewWorker/AboutViewWorker.js')
  await About.showAbout()
  expect(AboutViewWorker.invoke).toHaveBeenCalledTimes(1)
  expect(AboutViewWorker.invoke).toHaveBeenCalledWith('About.showAbout', PlatformType.Electron)
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
  const AboutViewWorker = await import('../src/parts/AboutViewWorker/AboutViewWorker.js')
  await About.showAbout()
  expect(AboutViewWorker.invoke).toHaveBeenCalledTimes(1)
  expect(AboutViewWorker.invoke).toHaveBeenCalledWith('About.showAbout', PlatformType.Web)
})
