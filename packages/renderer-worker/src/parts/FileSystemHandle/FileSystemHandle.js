import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const requestPermission = async (handle, options) => {
  // query permission, but from renderer process
  // because handle.requestPermission is not implemented
  // in a worker, see https://github.com/WICG/file-system-access/issues/289
  const permissionTypeNow = await RendererProcess.invoke(
    'FileSystemHandle.requestPermission',
    handle,
    options
  )
  return permissionTypeNow
}
