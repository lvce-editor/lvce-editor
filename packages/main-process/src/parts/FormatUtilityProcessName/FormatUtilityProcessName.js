import * as CamelCase from '../CamelCase/CamelCase.js'

export const formatUtilityProcessName = (name) => {
  return CamelCase.camelCase(name)
}
