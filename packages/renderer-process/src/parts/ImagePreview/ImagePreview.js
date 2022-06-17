import * as Widget from '../Widget/Widget.js'

const handleImageLoad = (event) => {
  const $ImagePreviewImage = event.target
  const $ImagePreviewCaption = $ImagePreviewImage.nextSibling
  const width = $ImagePreviewImage.naturalWidth
  const height = $ImagePreviewImage.naturalHeight
  $ImagePreviewCaption.textContent = `${width} × ${height}`
}

const handleImageError = (event) => {
  const $ImagePreviewImage = event.target
  const $ImagePreviewCaption = $ImagePreviewImage.nextSibling
  $ImagePreviewCaption.textContent = 'Image could not be loaded'
}

// TODO duplicate code with below

export const showError = (message, top, left) => {
  const $ImagePreviewImage = document.createElement('img')
  $ImagePreviewImage.className = 'ImagePreviewImage'
  $ImagePreviewImage.alt = ''
  const $ImagePreviewCaption = document.createElement('figcaption')
  $ImagePreviewCaption.className = 'ImagePreviewCaption'
  $ImagePreviewCaption.textContent = message
  const $ImagePreview = document.createElement('figure')
  $ImagePreview.className = 'ImagePreview'
  $ImagePreview.append($ImagePreviewImage, $ImagePreviewCaption)
  $ImagePreview.style.top = `${top}px`
  $ImagePreview.style.left = `${left}px`
  $ImagePreview.style.display = 'none'
  Widget.append($ImagePreview)
  return {
    $ImagePreview,
    $ImagePreviewCaption,
    $ImagePreviewImage,
  }
}

export const create = (uri, top, left) => {
  const $ImagePreviewImage = document.createElement('img')
  $ImagePreviewImage.className = 'ImagePreviewImage'
  $ImagePreviewImage.src = uri
  $ImagePreviewImage.alt = ''
  const $ImagePreviewCaption = document.createElement('figcaption')
  $ImagePreviewCaption.className = 'ImagePreviewCaption'
  const $ImagePreview = document.createElement('figure')
  $ImagePreview.className = 'ImagePreview'
  $ImagePreview.append($ImagePreviewImage, $ImagePreviewCaption)
  $ImagePreviewImage.onload = handleImageLoad
  $ImagePreviewImage.onerror = handleImageError
  $ImagePreview.style.top = `${top}px`
  $ImagePreview.style.left = `${left}px`
  $ImagePreview.style.display = 'none'
  Widget.append($ImagePreview)
  return {
    $ImagePreview,
    $ImagePreviewCaption,
    $ImagePreviewImage,
  }
}

export const update = (state, uri) => {
  state.$ImagePreviewImage.uri = uri
}

export const dispose = (state) => {
  Widget.remove(state.$ImagePreview)
}
