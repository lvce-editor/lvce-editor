import * as Ajax from '../Ajax/Ajax.js'
import * as Exec from '../Exec/Exec.js'

export const commandMap = {
  'Exec.exec': Exec.exec,
  'Ajax.getJson': Ajax.getJson,
}
