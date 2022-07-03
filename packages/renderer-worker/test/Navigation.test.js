import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/RendererProcess/RendererProcess.js',
  () => {
    return {
      invoke: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)
jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const RendererProcess = await import(
  '../src/parts/RendererProcess/RendererProcess.js'
)

const Navigation = await import('../src/parts/Navigation/Navigation.js')

test('focusTitleBar', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await Navigation.focusTitleBar()
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(1331)
})

test('focusActivityBar', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await Navigation.focusActivityBar()
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(717115)
})

test('focusStatusBar', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await Navigation.focusStatusBar()
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(8882)
})

test('focusPanel', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await Navigation.focusPanel()
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(6664)
})

test('focusSideBar', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await Navigation.focusSideBar()
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(5554)
})

test('focusMain', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await Navigation.focusMain()
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(2145)
})

test('focusPart', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await Navigation.focusPart(/* PART_TITLE_BAR */ 1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(1331)
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await Navigation.focusPart(/* PART_MAIN */ 2)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(2145)
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await Navigation.focusPart(/* PART_PANEL */ 3)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(6664)
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await Navigation.focusPart(/* PART_STATUS_BAR */ 4)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(8882)
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await Navigation.focusPart(/* PART_SIDE_BAR */ 5)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(5554)
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await Navigation.focusPart(/* PART_ACTIVITY_BAR */ 6)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(717115)
})

test('focusNextPart', async () => {
  Navigation.state.focusedPart = /* PART_TITLE_BAR */ 1
  await Navigation.focusNextPart()
  expect(Navigation.state.focusedPart).toBe(/* PART_MAIN */ 2)
  await Navigation.focusNextPart()
  expect(Navigation.state.focusedPart).toBe(/* PART_PANEL */ 3)
  await Navigation.focusNextPart()
  expect(Navigation.state.focusedPart).toBe(/* PART_STATUS_BAR */ 4)
  await Navigation.focusNextPart()
  expect(Navigation.state.focusedPart).toBe(/* PART_SIDE_BAR */ 5)
  await Navigation.focusNextPart()
  expect(Navigation.state.focusedPart).toBe(/* PART_ACTIVITY_BAR */ 6)
  await Navigation.focusNextPart()
  expect(Navigation.state.focusedPart).toBe(/* PART_TITLE_BAR */ 1)
})

test('focusPreviousPart', () => {
  Navigation.state.focusedPart = /* PART_TITLE_BAR */ 1
  Navigation.focusPreviousPart()
  expect(Navigation.state.focusedPart).toBe(/* PART_ACTIVITY_BAR */ 6)
  Navigation.focusPreviousPart()
  expect(Navigation.state.focusedPart).toBe(/* PART_SIDE_BAR */ 5)
  Navigation.focusPreviousPart()
  expect(Navigation.state.focusedPart).toBe(/* PART_STATUS_BAR */ 4)
  Navigation.focusPreviousPart()
  expect(Navigation.state.focusedPart).toBe(/* PART_PANEL */ 3)
  Navigation.focusPreviousPart()
  expect(Navigation.state.focusedPart).toBe(/* PART_MAIN */ 2)
  Navigation.focusPreviousPart()
  expect(Navigation.state.focusedPart).toBe(/* PART_TITLE_BAR */ 1)
})
