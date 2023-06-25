import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const getFallbackModuleId = (moduleId) => {
  switch (moduleId) {
    case ViewletModuleId.EditorText:
      return ViewletModuleId.EditorError
    default:
      return ViewletModuleId.Error
  }
}
