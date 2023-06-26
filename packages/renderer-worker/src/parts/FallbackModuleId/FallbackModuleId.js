import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const getFallbackModuleId = (moduleId) => {
  switch (moduleId) {
    case ViewletModuleId.EditorText:
      return ViewletModuleId.EditorError
    case ViewletModuleId.EditorCompletion:
    case ViewletModuleId.EditorRename:
      return ViewletModuleId.EditorWidgetError
    default:
      return ViewletModuleId.Error
  }
}
