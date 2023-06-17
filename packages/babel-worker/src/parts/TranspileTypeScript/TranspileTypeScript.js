import babel from '@babel/core'
import preset from '@babel/preset-typescript'

export const transpileTypeScript = (code) => {
  const result = babel.transformSync(code, {
    presets: [preset],
    filename: 'script.ts',
  })
  if (!result) {
    return ''
  }
  return result.code
}
