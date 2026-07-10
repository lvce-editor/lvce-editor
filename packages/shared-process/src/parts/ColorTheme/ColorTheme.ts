import * as JoinLines from '../JoinLines/JoinLines.ts'

export const getColorThemeJson = async (): Promise<any> => {
  return {
    FocusOutline: `#3d5252`,
    MainBackground: '#1e2324',
    TreeItemForeground: ` rgb(188, 190, 190)`,
  }
}

const toInnerLine = ([key, value]: any): any => {
  return `  --${key}: ${value};`
}

export const toCss = (colorThemeJson: any): any => {
  const innerLines = Object.entries(colorThemeJson).map(toInnerLine)
  const css = `:root {
${JoinLines.joinLines(innerLines)}
}`
  return css
}
