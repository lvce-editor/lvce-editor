import * as Platform from '../Platform/Platform.js'
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

export const setFilePath = (dataTransfer, filePath, fileName) => {
  dataTransfer.setData(DataTransferType.ResourceUrls, JSON.stringify([filePath]))
  dataTransfer.setData(DataTransferType.Text, filePath)
  const dragImage = document.createElement('div')
  dragImage.className = 'DragImage'
  if (Platform.getBrowser() !== 'chromium') {
    // chrome doesn't support border radius
    dragImage.style.borderRadius = '100px'
  }
  dragImage.textContent = fileName
  document.body.append(dragImage)
  dataTransfer.setDragImage(dragImage, -10, -10)
  const handleTimeOut = () => {
    dragImage.remove()
  }
  setTimeout(handleTimeOut, 0)
}

export const getFilePaths = (dataTransfer) => {
  const data = dataTransfer.getData(DataTransferType.ResourceUrls)
  if (data) {
    const parsed = JSON.parse(data)
    if (Array.isArray(parsed) && data.length > 0) {
      return parsed
    }
  }
  return []
}

export const getFilePath = (dataTransfer) => {
  const filePaths = getFilePaths(dataTransfer)
  if (filePaths.length === 0) {
    return ''
  }
  return filePaths[0]
}
