import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/SimpleBrowserOverlay/SimpleBrowserOverlay.js', () => ({
  hide: jest.fn(),
  show: jest.fn(),
}))

const SimpleBrowserOverlay = await import('../src/parts/SimpleBrowserOverlay/SimpleBrowserOverlay.js')
const TitleBarMenuOverlay = await import('../src/parts/ViewletTitleBar/TitleBarMenuOverlay.js')

beforeEach(() => {
  jest.clearAllMocks()
})

test('shows the title bar menu overlay', async () => {
  await TitleBarMenuOverlay.show()

  expect(SimpleBrowserOverlay.show).toHaveBeenCalledWith('title-bar-menu')
})

test('hides the title bar menu overlay after the menu has rendered closed', async () => {
  await TitleBarMenuOverlay.afterRender({ titleBarMenuOpen: true }, { titleBarMenuOpen: false })

  expect(SimpleBrowserOverlay.hide).toHaveBeenCalledWith('title-bar-menu')
})

test('keeps the title bar menu overlay while a menu remains open', async () => {
  await TitleBarMenuOverlay.afterRender({ titleBarMenuOpen: true }, { titleBarMenuOpen: true })

  expect(SimpleBrowserOverlay.hide).not.toHaveBeenCalled()
})
