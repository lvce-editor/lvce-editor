const rgba = (r, g, b, a) => {
  r = Math.min(255, Math.max(0, r)) | 0
  g = Math.min(255, Math.max(0, g)) | 0
  b = Math.min(255, Math.max(0, b)) | 0
  return {
    r,
    g,
    b,
    a,
  }
}

const darken = () => {}

const lighten = () => {}

const transparent = (color, factor) => {
  return color
}

const isValidHexColor = (value) => {
  return true
}

const toColorRule = ([key, value]) => {
  return `  --${key}: ${value};`
}

const toTokenColorRule = (tokenColor) => {
  return `.Token.${tokenColor.name} { color: ${tokenColor.foreground} }`
}

export const createColorThemeFromJson = (colorThemeId, colorThemeJson) => {
  if (!colorThemeJson) {
    console.warn(
      `color theme json for "${colorThemeId}" is empty: "${colorThemeJson}"`
    )
    return ''
  }
  if (typeof colorThemeJson !== 'object') {
    console.warn(
      `color theme json for "${colorThemeId}" cannot be converted to css: "${colorThemeJson}"`
    )
    return ''
  }
  if (Array.isArray(colorThemeJson)) {
    console.warn(
      `color theme json for "${colorThemeId}" cannot be converted to css, it must be of type object but was of type array`
    )
    return ''
  }
  const colors = colorThemeJson.colors
  if (!colors) {
    return ''
  }
  if (!colors.ActivityBarInactiveForeground) {
    // TODO don't assign, avoid mutation
    colors.ActivityBarInactiveForeground = transparent(
      colors.ActivityBarForeground,
      0.4
    )
  }
  const colorRules = Object.entries(colors).map(toColorRule)
  const tokenColors = colorThemeJson.tokenColors || []
  const tokenColorRules = tokenColors.map(toTokenColorRule)
  const extraRules = []
  if (colors.ContrastBorder) {
    console.log('has contrast border')
    extraRules.push(
      `#ActivityBar, #SideBar {
  border-left: 1px solid var(--ContrastBorder);
}`,
      `#Panel {
  border-top: 1px solid var(--ContrastBorder);
}`,
      `#StatusBar {
  border-top: 1px solid var(--ContrastBorder);
}`,
      `.ActivityBarItemBadge {
  border: 1px solid var(--ContrastBorder);
}`,
      `#QuickPick {
  border: 1px solid var(--ContrastBorder);
}`
    )
  }
  const colorThemeCss = `:root {\n${colorRules.join(
    '\n'
  )}\n}\n\n${tokenColorRules.join('\n')}\n\n${extraRules.join('\n')}`
  return colorThemeCss
}

// for (let i = 0; i < 10000; i++) {
//   createColorThemeFromJson({
//     type: 'dark',
//     colors: {
//       ActivityBarBackground: 'rgb(40, 46, 47)',
//       ActivityBarForeground: '#878f8c',
//       ActivityBarActiveBackground: '#1f2727',

//       EditorBackGround: '#1e2324',
//       EditorScrollBarBackground: 'rgba(57, 71, 71, 0.6)',
//       EditorCursorBackground: '#a8df5a',

//       ListActiveSelectionBackground: '#515f59',
//       ListActiveSelectionForeground: '#ffffff',
//       ListHoverBackground: '#405c5033',
//       ListHoverForeground: '#e0e0e0',
//       ListInactiveSelectionBackground: '#3b474280',

//       MainBackground: '#1e2324',

//       PanelBackground: '#1b2020',
//       PanelBorderTopColor: 'rgba(128, 128, 128, 0.35)',

//       SideBarBackground: '#1b2020',

//       StatusBarBackground: 'rgb(40, 46, 47)',
//       StatusBarBorderTopColor: '#222222',

//       TabActiveBackground: '#24292a',
//       TabInactiveBackground: '#282e2f',

//       TitleBarBackground: 'rgb(40, 46, 47)',
//       TitleBarBorderBottomColor: '#222',
//       TitleBarColor: '#cccccc',
//       TitleBarColorInactive: 'rgba(204, 204, 204, 0.6)',
//     },
//   }) //?.
// }
