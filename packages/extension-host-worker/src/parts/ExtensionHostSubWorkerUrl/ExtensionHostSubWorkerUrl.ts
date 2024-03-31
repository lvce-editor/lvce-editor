const getExtensionHostSubWorkerUrl = () => {
  return new URL('../../../../extension-host-sub-worker/src/extensionHostSubWorkerMain.js', import.meta.url).toString()
}

export const extensionHostSubWorkerUrl = getExtensionHostSubWorkerUrl()
