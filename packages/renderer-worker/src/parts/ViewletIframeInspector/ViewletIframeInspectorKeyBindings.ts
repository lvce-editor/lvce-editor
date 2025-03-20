import * as IframeInspectorWorker from '../IframeInspectorWorker/IframeInspectorWorker.js'

export const getKeyBindings = () => {
  return IframeInspectorWorker.invoke('IframeInspector.getKeyBindings')
}
