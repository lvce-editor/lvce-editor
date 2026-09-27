import { beforeEach, expect, jest, test } from '@jest/globals'

const reloadDynamicCss = jest.fn()
const getValues = jest.fn()
const preferencesState = {
  'editor.fontFamily': 'serif',
}

jest.unstable_mockModule('../src/parts/Css/Css.js', () => ({
  reloadDynamicCss,
}))

jest.unstable_mockModule('../src/parts/Preferences/Preferences.js', () => ({
  state: preferencesState,
}))

jest.unstable_mockModule('../src/parts/ViewletStates/ViewletStates.js', () => ({
  getValues,
}))

const ViewletManagerVisitorCss = await import('../src/parts/ViewletManagerVisitorCss/ViewletManagerVisitorCss.js')

beforeEach(() => {
  jest.resetAllMocks()
})

test('reloadDynamicCss updates each acquired dynamic stylesheet once', async () => {
  const editorGetDynamicCss = jest.fn()
  const diffEditorGetDynamicCss = jest.fn()
  getValues.mockReturnValue([
    {
      factory: { getDynamicCss: editorGetDynamicCss },
      moduleId: 'Editor',
    },
    {
      factory: { getDynamicCss: editorGetDynamicCss },
      moduleId: 'Editor',
    },
    {
      factory: { getDynamicCss: diffEditorGetDynamicCss },
      moduleId: 'DiffView',
    },
    {
      factory: {},
      moduleId: 'NoDynamicCss',
    },
  ])

  await ViewletManagerVisitorCss.reloadDynamicCss()

  expect(reloadDynamicCss).toHaveBeenCalledTimes(2)
  expect(reloadDynamicCss).toHaveBeenNthCalledWith(1, 'Editor', editorGetDynamicCss, preferencesState)
  expect(reloadDynamicCss).toHaveBeenNthCalledWith(2, 'DiffView', diffEditorGetDynamicCss, preferencesState)
})
