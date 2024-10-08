import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const getFallbackModuleId = (moduleId) => {
  switch (moduleId) {
    case ViewletModuleId.EditorText:
      // @ts-ignore
      return ViewletModuleId.EditorError
    // @ts-ignore
    case ViewletModuleId.EditorRename:
      return ViewletModuleId.EditorWidgetError
    default:
      return ViewletModuleId.Error
  }
}
