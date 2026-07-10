import * as AddSemiColon from '../AddSemiColon/AddSemiColon.ts'
import * as Character from '../Character/Character.ts'

export const getContentSecurityPolicy = (items: any): any => {
  return items.map(AddSemiColon.addSemicolon).join(Character.Space)
}
