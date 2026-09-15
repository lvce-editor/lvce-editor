import * as ApplicationRegistry from '../ApplicationRegistry/ApplicationRegistry.ts'
import * as ComponentState from '../ComponentState/ComponentState.js'
import * as DirentType from '../DirentType/DirentType.js'
import * as FileSystemComponentState from '../FileSystem/FileSystemComponentState.js'

const pattern = /^live-component-state:\/\/\/(?:dom\/|schemas\/)?(\d+(?:\.\d+)?)\.json$/

export const execute = async (applicationId: string, method: string, uri: string, ...args: readonly any[]): Promise<any> => {
  const application = ApplicationRegistry.assertOpen(applicationId)
  if (method === 'readDirWithFileTypes' && uri === 'live-component-state:///') {
    return ComponentState.getComponents(application.layoutUid)
      .filter((component) => component.editable)
      .map((component) => ({ name: `${component.uid}.json`, type: DirentType.File }))
  }
  const match = pattern.exec(uri)
  if (!match || ApplicationRegistry.getOwner(Number(match[1])) !== applicationId) {
    if (method === 'exists') {
      return false
    }
    throw new Error(`Component state does not belong to application ${applicationId}: ${uri}`)
  }
  const fn = FileSystemComponentState[method]
  if (typeof fn !== 'function') {
    throw new Error(`Unsupported component state filesystem operation: ${method}`)
  }
  return fn(uri, ...args)
}
