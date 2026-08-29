import * as MimeType from '../MimeType/MimeType.js'
import * as Url from '../Url/Url.js'

export const create = (bytes) => {
  const blob = new Blob([bytes], { type: MimeType.ImagePng })
  return Url.createObjectUrl(blob)
}

export const dispose = (snapshot) => {
  if (snapshot) {
    Url.revokeObjectUrl(snapshot)
  }
}
