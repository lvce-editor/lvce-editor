import { beforeEach, expect, jest, test } from '@jest/globals'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/AboutViewWorker/AboutViewWorker.js', () => {
  return {
    dispose: jest.fn(),
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
  expect(AboutViewWorker.dispose).toHaveBeenCalledTimes(1)
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
  expect(AboutViewWorker.dispose).not.toHaveBeenCalled()
})

test('showAbout - electron waits for all open dialogs before disposing worker', async () => {
  jest.resetModules()
  let resolveFirst: () => void = () => {}
  let resolveSecond: () => void = () => {}
  const firstInvocation = new Promise<void>((resolve) => {
    resolveFirst = resolve
  })
  const secondInvocation = new Promise<void>((resolve) => {
    resolveSecond = resolve
  })
  jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => ({
    getPlatform: () => PlatformType.Electron,
  }))
  jest.unstable_mockModule('../src/parts/AboutViewWorker/AboutViewWorker.js', () => ({
    dispose: jest.fn(),
    invoke: jest.fn().mockReturnValueOnce(firstInvocation).mockReturnValueOnce(secondInvocation),
  }))

  const About = await import('../src/parts/About/About.js')
  const AboutViewWorker = await import('../src/parts/AboutViewWorker/AboutViewWorker.js')
  const first = About.showAbout()
  const second = About.showAbout()

  resolveFirst()
  await first
  expect(AboutViewWorker.dispose).not.toHaveBeenCalled()

  resolveSecond()
  await second
  expect(AboutViewWorker.dispose).toHaveBeenCalledTimes(1)
})
