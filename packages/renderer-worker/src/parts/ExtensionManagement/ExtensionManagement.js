import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as ExtensionManifestStatus from '../ExtensionManifestStatus/ExtensionManifestStatus.js'

export const install = (id) => {
  return SharedProcess.invoke(
    /* ExtensionManagement.install */ 'ExtensionManagement.install',
    /* id */ id
  )
}

export const uninstall = (id) => {
  return SharedProcess.invoke(
    /* ExtensionManagement.uninstall */ 'ExtensionManagement.uninstall',
    /* id */ id
  )
}

export const disable = async (id) => {
  return SharedProcess.invoke(
    /* ExtensionManagement.disable */ 'ExtensionManagement.disable',
    /* id */ id
  )
}

export const enable = async (id) => {
  return SharedProcess.invoke(
    /* ExtensionManagement.enable */ 'ExtensionManagement.enable',
    /* id */ id
  )
}

export const getAllExtensions = async () => {
  return SharedProcess.invoke(
    /* ExtensionManagement.getAllExtensions */ 'ExtensionManagement.getAllExtensions'
  )
}

const isFulfilled = (result) => {
  return result.status === ExtensionManifestStatus.Resolved
}

const getValue = (result) => {
  return result.value
}

export const getWorkingExtensions = async () => {
  const allExtensions = await getAllExtensions()
  const fullFilledExtensions = allExtensions.filter(isFulfilled).map(getValue)
}
