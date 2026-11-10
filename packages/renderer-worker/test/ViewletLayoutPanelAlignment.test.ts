import { beforeEach, expect, jest, test } from '@jest/globals'
import * as LayoutPoints from '../src/parts/ViewletLayout/LayoutPoints.ts'
import * as SideBarLocationType from '../src/parts/SideBarLocationType/SideBarLocationType.js'

const getPreference = jest.fn()
const updatePreferences = jest.fn(async (_settings: Record<string, string>) => undefined)

jest.unstable_mockModule('../src/parts/Preferences/Preferences.js', () => ({
  get: getPreference,
  update: updatePreferences,
}))

const ViewletLayout = await import('../src/parts/ViewletLayout/ViewletLayout.ts')

const createState = (sideBarLocation: number, panelAlignment: 'center' | 'justify' | 'left' | 'right', sideBarsVisible = true, windowWidth = 1200) => {
  return LayoutPoints.getPoints({
    ...ViewletLayout.create(1),
    activityBarVisible: true,
    activityBarWidth: 48,
    panelAlignment,
    panelHeight: 200,
    panelMinHeight: 150,
    panelMaxHeight: 600,
    panelVisible: true,
    sideBarLocation,
    sideBarMinWidth: 170,
    sideBarMaxWidth: 9999999,
    sideBarVisible: sideBarsVisible,
    sideBarWidth: 240,
    secondarySideBarMinWidth: 220,
    secondarySideBarMaxWidth: 9999999,
    secondarySideBarVisible: sideBarsVisible,
    secondarySideBarWidth: 260,
    statusBarHeight: 20,
    statusBarVisible: true,
    titleBarHeight: 35,
    titleBarVisible: true,
    windowHeight: 800,
    windowWidth,
  })
}

beforeEach(() => {
  getPreference.mockReturnValue(undefined)
  updatePreferences.mockClear()
})

for (const [locationName, location] of [
  ['left', SideBarLocationType.Left],
  ['right', SideBarLocationType.Right],
] as const) {
  test.each(['center', 'justify', 'left', 'right'] as const)(`panel alignment %s places bounds and sidebars correctly with primary sidebar on the ${locationName}`, (alignment) => {
    const state = createState(location, alignment)
    const full = createState(location, 'justify')
    const mainRight = full.mainLeft + full.mainWidth
    const contentBottom = full.panelTop + full.panelHeight

    switch (alignment) {
      case 'center':
        expect(state).toMatchObject({ panelLeft: full.mainLeft, panelWidth: full.mainWidth })
        break
      case 'justify':
        expect(state).toMatchObject({ panelLeft: 0, panelWidth: full.panelWidth })
        break
      case 'left':
        expect(state).toMatchObject({ panelLeft: 0, panelWidth: mainRight })
        break
      case 'right':
        expect(state).toMatchObject({ panelLeft: full.mainLeft, panelWidth: full.panelWidth - full.mainLeft })
        break
    }

    const leftSideBarHeight = alignment === 'left' || alignment === 'justify' ? state.panelTop - state.sideBarTop : contentBottom - state.sideBarTop
    const rightSideBarHeight = alignment === 'right' || alignment === 'justify' ? state.panelTop - state.secondarySideBarTop : contentBottom - state.secondarySideBarTop
    expect(state.sideBarHeight).toBe(location === SideBarLocationType.Left ? leftSideBarHeight : rightSideBarHeight)
    expect(state.secondarySideBarHeight).toBe(location === SideBarLocationType.Left ? rightSideBarHeight : leftSideBarHeight)
  })
}

test('panel alignment keeps sensible bounds at narrow widths with hidden sidebars', () => {
  for (const location of [SideBarLocationType.Left, SideBarLocationType.Right]) {
    for (const alignment of ['center', 'justify', 'left', 'right'] as const) {
      const state = createState(location, alignment, false, 420)
      const fullWidth = createState(location, 'justify', false, 420)
      const mainRight = state.mainLeft + state.mainWidth
      expect(state.sideBarVisible).toBe(false)
      expect(state.secondarySideBarVisible).toBe(false)
      expect(state.panelLeft).toBeGreaterThanOrEqual(0)
      expect(state.panelWidth).toBeGreaterThanOrEqual(0)
      expect(state.panelLeft + state.panelWidth).toBeLessThanOrEqual(state.windowWidth)
      switch (alignment) {
        case 'center':
          expect(state).toMatchObject({ panelLeft: state.mainLeft, panelWidth: state.mainWidth })
          break
        case 'justify':
          expect(state).toMatchObject({ panelLeft: 0, panelWidth: fullWidth.panelWidth })
          break
        case 'left':
          expect(state).toMatchObject({ panelLeft: 0, panelWidth: mainRight })
          break
        case 'right':
          expect(state).toMatchObject({ panelLeft: state.mainLeft, panelWidth: fullWidth.panelWidth - state.mainLeft })
          break
      }
    }
  }
})

test('panel alignment is saved and restored', () => {
  const original = createState(SideBarLocationType.Right, 'left')
  const saved = ViewletLayout.saveState(original)
  const restored = ViewletLayout.loadContent(original, {
    ...saved,
    Layout: { bounds: { windowWidth: 1200, windowHeight: 800 } },
  })

  expect(saved.panelAlignment).toBe('left')
  expect(restored.panelAlignment).toBe('left')
  expect(restored.panelLeft).toBe(0)
})

test.each(['center', 'justify', 'left', 'right'] as const)('panel alignment preference %s overrides restored layout state', (alignment) => {
  getPreference.mockReturnValue(alignment)
  const original = createState(SideBarLocationType.Right, 'justify')
  const saved = ViewletLayout.saveState(original)
  const restored = ViewletLayout.loadContent(original, {
    ...saved,
    Layout: { bounds: { windowWidth: 1200, windowHeight: 800 } },
  })

  expect(restored.panelAlignment).toBe(alignment)
})

test('invalid panel alignment preference falls back to justify', () => {
  getPreference.mockReturnValue('invalid')
  const original = createState(SideBarLocationType.Right, 'left')
  const saved = ViewletLayout.saveState(original)
  const restored = ViewletLayout.loadContent(original, {
    ...saved,
    Layout: { bounds: { windowWidth: 1200, windowHeight: 800 } },
  })

  expect(restored.panelAlignment).toBe('justify')
})

test('setPanelAlignment recalculates panel bounds immediately', async () => {
  const state = createState(SideBarLocationType.Right, 'justify')
  const result = await ViewletLayout.setPanelAlignment(state, 'center')

  expect(result.newState.panelAlignment).toBe('center')
  expect(result.newState.panelLeft).toBe(state.mainLeft)
  expect(result.newState.panelWidth).toBe(state.mainWidth)
  expect(updatePreferences).toHaveBeenCalledWith({ 'workbench.panel.alignment': 'center' })
})
