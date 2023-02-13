import * as DataTransferType from '../DataTransferType/DataTransferType.js'

export const setEffectAllowed = (dataTransfer, effectAllowed) => {
  dataTransfer.effectAllowed = effectAllowed
}

export const setDropEffect = (dataTransfer, dropEffect) => {
  dataTransfer.dropEffect = dropEffect
}

export const setData = (dataTransfer, key, value) => {
  dataTransfer.setData(key, value)
}

export const getData = (dataTransfer, key) => {
  return dataTransfer.getData(key)
}

export const setFilePath = (dataTransfer, filePath) => {
  dataTransfer.setData(DataTransferType.ResourceUrls, JSON.stringify([filePath]))
  dataTransfer.setData(DataTransferType.Text, filePath)
}

export const getFilePath = (dataTransfer) => {
  const data = dataTransfer.getData(DataTransferType.ResourceUrls)
  if (data) {
    const parsed = JSON.parse(data)
    if (Array.isArray(parsed) && data.length > 0) {
      return parsed[0]
    }
  }
  return ''
}
