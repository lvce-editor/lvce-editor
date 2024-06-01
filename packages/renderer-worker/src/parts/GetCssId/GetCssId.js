import * as Character from '../Character/Character.js'

export const getCssId = (path) => {
  return 'Css' + path.replace('/css/parts/', '').replaceAll(Character.Slash, Character.Dash).replace('.css', Character.EmptyString)
}
