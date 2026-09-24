import * as FindWidgetWorkerUrl from '../FindWidgetWorkerUrl/FindWidgetWorkerUrl.js'
import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'

export const getFindWidgetWorkerUrl = () => {
  return GetConfiguredWorkerUrl.getConfiguredWorkerUrl('develop.findWidgetWorkerPath', FindWidgetWorkerUrl.findWidgetWorkerUrl)
}
