import { jest } from '@jest/globals'
import * as ColorThemeFromJson from '../src/parts/ColorThemeFromJson/ColorThemeFromJson.js'

afterEach(() => {
  jest.resetAllMocks()
})
// TODO test token colors

test('createColorThemeFromJson - colors', () => {
  expect(
    ColorThemeFromJson.createColorThemeFromJson('test-theme', {
      type: 'dark',
      colors: {
        ActivityBarBackground: 'rgb(40, 46, 47)',
        ActivityBarForeground: '#878f8c',
        ActivityBarActiveBackground: '#1f2727',

        EditorBackGround: '#1e2324',
        EditorScrollBarBackground: 'rgba(57, 71, 71, 0.6)',
        EditorCursorBackground: '#a8df5a',

        ListActiveSelectionBackground: '#515f59',
        ListActiveSelectionForeground: '#ffffff',
        ListHoverBackground: '#405c5033',
        ListHoverForeground: '#e0e0e0',
        ListInactiveSelectionBackground: '#3b474280',

        MainBackground: '#1e2324',

        PanelBackground: '#1b2020',
        PanelBorderTopColor: 'rgba(128, 128, 128, 0.35)',

        SideBarBackground: '#1b2020',

        StatusBarBackground: 'rgb(40, 46, 47)',
        StatusBarBorderTopColor: '#222222',

        TabActiveBackground: '#24292a',
        TabInactiveBackground: '#282e2f',

        TitleBarBackground: 'rgb(40, 46, 47)',
        TitleBarBorderBottomColor: '#222',
        TitleBarColor: '#cccccc',
        TitleBarColorInactive: 'rgba(204, 204, 204, 0.6)',
      },
    })
  ).toBe(`:root {
  --ActivityBarBackground: rgb(40, 46, 47);
  --ActivityBarForeground: #878f8c;
  --ActivityBarActiveBackground: #1f2727;
  --EditorBackGround: #1e2324;
  --EditorScrollBarBackground: rgba(57, 71, 71, 0.6);
  --EditorCursorBackground: #a8df5a;
  --ListActiveSelectionBackground: #515f59;
  --ListActiveSelectionForeground: #ffffff;
  --ListHoverBackground: #405c5033;
  --ListHoverForeground: #e0e0e0;
  --ListInactiveSelectionBackground: #3b474280;
  --MainBackground: #1e2324;
  --PanelBackground: #1b2020;
  --PanelBorderTopColor: rgba(128, 128, 128, 0.35);
  --SideBarBackground: #1b2020;
  --StatusBarBackground: rgb(40, 46, 47);
  --StatusBarBorderTopColor: #222222;
  --TabActiveBackground: #24292a;
  --TabInactiveBackground: #282e2f;
  --TitleBarBackground: rgb(40, 46, 47);
  --TitleBarBorderBottomColor: #222;
  --TitleBarColor: #cccccc;
  --TitleBarColorInactive: rgba(204, 204, 204, 0.6);
  --ActivityBarInactiveForeground: #878f8c;
}



`)
})

test('createColorThemeFromJson - colors with contrast border', () => {
  expect(
    ColorThemeFromJson.createColorThemeFromJson('test-theme', {
      type: 'dark',
      colors: {
        ActivityBarBackground: 'rgb(40, 46, 47)',
        ContrastBorder: 'rgb(78,78,78)',
      },
    })
  ).toBe(`:root {
  --ActivityBarBackground: rgb(40, 46, 47);
  --ContrastBorder: rgb(78,78,78);
  --ActivityBarInactiveForeground: undefined;
}



#ActivityBar, #SideBar {
  border-left: 1px solid var(--ContrastBorder);
}
#Panel {
  border-top: 1px solid var(--ContrastBorder);
}
#StatusBar {
  border-top: 1px solid var(--ContrastBorder);
}
.ActivityBarItemBadge {
  border: 1px solid var(--ContrastBorder);
}
#QuickPick {
  border: 1px solid var(--ContrastBorder);
}`)
})

test('createColorThemeFromJson - invalid argument null', () => {
  const spy = jest.spyOn(console, 'warn').mockImplementation(() => {})
  expect(
    ColorThemeFromJson.createColorThemeFromJson('test-theme', null)
  ).toEqual('')
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith(
    'color theme json for "test-theme" is empty: "null"'
  )
})

test('createColorThemeFromJson - invalid argument number', () => {
  const spy = jest.spyOn(console, 'warn').mockImplementation(() => {})
  expect(ColorThemeFromJson.createColorThemeFromJson('test-theme', 78)).toEqual(
    ''
  )
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith(
    'color theme json for "test-theme" cannot be converted to css: "78"'
  )
})

test('createColorThemeFromJson - invalid argument array', () => {
  const spy = jest.spyOn(console, 'warn').mockImplementation(() => {})
  expect(ColorThemeFromJson.createColorThemeFromJson('test-theme', [])).toEqual(
    ''
  )
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith(
    'color theme json for "test-theme" cannot be converted to css, it must be of type object but was of type array'
  )
})
