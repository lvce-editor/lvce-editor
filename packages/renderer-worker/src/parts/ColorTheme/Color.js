// Based on https://github.com/microsoft/vscode/blob/main/src/vs/platform/theme/common/colorRegistry.ts by Microsoft (LICENSE MIT)

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

const darken = (value, factor) => {}

const lighten = (value, factor) => {}

const transparent = (value, factor) => {
  return value
}

const resolve = (value) => {
  return ''
}

export const executeTransform = (transform, theme) => {
  switch (transform.operation) {
    case 'darken':
      return darken(resolve(transform.value), transform.factor)
    case 'lighten':
      return lighten(resolve(transform.value), transform.factor)
    case 'transparent':
      return transparent(resolve(transform.value), transform.factor)
    case 'oneOf':
      return ''
    default:
      console.warn('unknown transform')
  }
}

export const ActivityBarBackground = {
  id: 'ActivityBarBackground',
  // dark:
}

export const ActivityBarForeground = {
  id: 'ActivityBarForeground',
  dark: '#fff',
  light: '#fff',
  highContrast: '#fff',
}

export const ActivityBarInactiveForeground = {
  id: 'ActivityBarInactiveForeground',
  dark: transparent('ActivityBarForeground', 0.4),
  light: transparent('ActivityBarForeground', 0.4),
  highContrast: '#fff',
}

export const ActivityBarBorder = {
  dark: undefined,
  light: undefined,
  highContrast: undefined,
}

export const SideBarBackground = {
  id: 'SideBarBackground',
  dark: '#252526',
  light: '#f3f3f3',
  highContrast: '#000000',
}

export const SideBarForeground = {
  id: 'SideBarForeground',
  dark: undefined,
  light: undefined,
  highContrast: undefined,
}

export const SideBarBorder = {
  id: 'SideBarBorder',
  dark: undefined,
  light: undefined,
  highContrast: undefined,
}

export const EditorLightBulbForeground = {
  id: 'EditorLightBulbForeground',
  dark: '#FFCC00',
  light: '#DDB100',
  highContrast: '#FFCC00',
}

export const EditorLightBulbAutoFixForeground = {
  id: 'EditorLightBulbAutoFixForeground',
  dark: '#FFCC00',
  light: '#DDB100',
  highContrast: '#FFCC00',
}

export const EditorSelectionBackground = {
  id: 'EditorSelectionBackground',
  dark: '#264F78',
  light: '#ADD6FF',
  highContrast: '#f3f518',
}

export const EditorSelectionForeground = {
  id: 'EditorSelectionBackground',
  dark: undefined,
  light: undefined,
  highContrast: undefined,
}

export const EditorInactiveSelection = {
  id: 'EditorSelectionBackground',
  dark: transparent('EditorSelectionBackground', 0.5),
  light: transparent('EditorSelectionBackground', 0.5),
  highContrast: transparent('EditorSelectionBackground', 0.5),
}

export const ListFocusBackground = {
  id: 'ListFocusBackground',
  dark: undefined,
  light: undefined,
  highContrast: undefined,
}

export const ListFocusForeground = {
  id: 'ListFocusForeground',
  dark: undefined,
  light: undefined,
  highContrast: undefined,
}

export const ListFocusOutline = {
  id: 'ListFocusOutline',
  dark: undefined,
  light: undefined,
  highContrast: undefined,
}

export const ListActiveSelectionBackground = {
  id: 'ListActiveSelectionBackground',
  dark: '#094771',
  light: '#0060C0',
  highContrast: undefined,
}

export const ListActiveSelectionForeground = {
  id: 'ListActiveSelectionForeground',
  dark: '#fff',
  light: '#fff',
  highContrast: undefined,
}

export const ListHoverBackground = {
  id: 'ListHoverBackground',
  dark: '#2A2D2E',
  light: '#F0F0F0',
  highContrast: undefined,
}

export const ListHoverForeground = {
  id: 'ListHoverForeground',
  dark: undefined,
  light: undefined,
  highContrast: undefined,
}
