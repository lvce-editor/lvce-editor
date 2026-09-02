import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/ElectronWebContentsViewFunctions/ElectronWebContentsViewFunctions.js', () => ({
  insertJavaScript: jest.fn(),
}))

const ElectronWebContentsViewFunctions = await import('../src/parts/ElectronWebContentsViewFunctions/ElectronWebContentsViewFunctions.js')
const SimpleBrowserPageSnapshot = await import('../src/parts/SimpleBrowserPageSnapshot/SimpleBrowserPageSnapshot.js')
const VirtualDomElements = await import('../src/parts/VirtualDomElements/VirtualDomElements.js')

beforeEach(() => {
  jest.resetAllMocks()
})

test('captures a page as virtual dom and stylesheet text', async () => {
  // @ts-ignore
  ElectronWebContentsViewFunctions.insertJavaScript.mockResolvedValue({
    css: '.card { color: red; }',
    dom: {
      type: 'html',
      attributes: { className: 'theme-dark' },
      children: [
        {
          type: 'body',
          attributes: {},
          children: [
            {
              type: 'article',
              attributes: { className: 'card', id: 'main' },
              children: [{ type: '#text', text: 'Hello' }],
            },
          ],
        },
      ],
    },
    url: 'https://docs.example.com/guide',
  })

  await expect(SimpleBrowserPageSnapshot.capture(12)).resolves.toEqual({
    css: '.card { color: red; }',
    dom: [
      {
        type: VirtualDomElements.Html,
        className: 'SimpleBrowserPreviewDocument theme-dark',
        childCount: 1,
      },
      {
        type: VirtualDomElements.Div,
        className: 'SimpleBrowserPreviewBody',
        childCount: 1,
      },
      {
        type: VirtualDomElements.Article,
        className: 'card',
        id: 'main',
        childCount: 1,
      },
      {
        type: VirtualDomElements.Text,
        text: 'Hello',
        childCount: 0,
      },
    ],
    key: 'webcontents-snapshot-example-com',
  })
  expect(ElectronWebContentsViewFunctions.insertJavaScript).toHaveBeenCalledWith(12, expect.stringContaining('document.adoptedStyleSheets'))
  expect(ElectronWebContentsViewFunctions.insertJavaScript).toHaveBeenCalledWith(12, expect.stringContaining('document.documentElement'))
})

test('scopes captured css using native css nesting', () => {
  expect(SimpleBrowserPageSnapshot.getScopedCss('.card { color: red; }')).toBe('.SimpleBrowserPreview {\n.card { color: red; }\n}')
})

test('uses a per-view stylesheet id', () => {
  expect(SimpleBrowserPageSnapshot.getStyleSheetId(42)).toBe('simple-browser-preview-42')
})
