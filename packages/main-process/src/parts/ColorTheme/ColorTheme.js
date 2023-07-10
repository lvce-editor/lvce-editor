import * as JoinLines from '../JoinLines/JoinLines.cjs'

const getExtensions = () => {}

export const getColorThemeJson = async () => {
  return {
    MainBackground: '#1e2324',
    TreeItemForeground: ` rgb(188, 190, 190)`,
    FocusOutline: `#3d5252`,
  }
}

const toInnerLine = ([key, value]) => {
  return `  --${key}: ${value};`
}

export const toCss = (colorThemeJson) => {
  const innerLines = Object.entries(colorThemeJson).map(toInnerLine)
  const css = `:root {
${JoinLines.joinLines(innerLines)}
}`
  return css
}
