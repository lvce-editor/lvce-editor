import babel from '@babel/core'
import preset from '@babel/preset-typescript'
import * as Assert from '../Assert/Assert.js'

export const transpileTypeScript = (code) => {
  Assert.string(code)
  const result = babel.transformSync(code, {
    presets: [preset],
    filename: 'script.ts',
  })
  if (!result) {
    return ''
  }
  return result.code
}
