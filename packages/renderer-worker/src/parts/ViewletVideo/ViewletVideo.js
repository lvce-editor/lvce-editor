import * as BlobSrc from '../BlobSrc/BlobSrc.js'
import * as I18nString from '../I18NString/I18NString.js'
import * as Id from '../Id/Id.js'
import * as MediaSource from '../MediaSource/MediaSource.js'
import * as Transferrable from '../Transferrable/Transferrable.js'

/**
 * @enum {string}
 */
const UiStrings = {
  FailedToLoadVideo: `Failed to load video: {PH1}`,
}

export const create = (id, uri) => {
  return {
    uri,
    src: '',
    errorMessage: '',
    mediaSourceId: 0,
    objectUrl: '',
  }
}

export const loadContent = async (state) => {
  const { uri } = state
  console.log({ uri })
  const src = await BlobSrc.getSrc(uri)
  console.log({ src })
  const mediaSource = MediaSource.create()

  mediaSource.addEventListener('sourceopen', async () => {
    console.log('source is open')

    const response = await fetch(src)
    var sourceBuffer = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.42E01E, mp4a.40.2"')
    const buffer = await response.arrayBuffer()
    sourceBuffer.appendBuffer(buffer)

    sourceBuffer.addEventListener('updateend', function (e) {
      console.log('update end')
      if (!sourceBuffer.updating && mediaSource.readyState === 'open') {
        mediaSource.endOfStream()
      }
    })
  })

  const handle = mediaSource.handle
  const mediaSourceId = Id.create()
  await Transferrable.transferToRendererProcess(mediaSourceId, handle)
  const objectUrl = URL.createObjectURL(mediaSource)

  return {
    ...state,
    src,
    mediaSourceId,
    objectUrl,
  }
}

const getImprovedErrorMessage = (message) => {
  return I18nString.i18nString(UiStrings.FailedToLoadVideo, {
    PH1: message,
  })
}

export const handleVideoError = (state, code, message) => {
  const improvedMessage = getImprovedErrorMessage(message)
  return {
    ...state,
    audioErrorMessage: improvedMessage,
  }
}

export const dispose = async (state) => {
  const { src } = state
  await BlobSrc.disposeSrc(src)
  return state
}

export const hasFunctionalRender = true

export const renderSrc = {
  isEqual(oldState, newState) {
    return oldState.objectUrl === newState.objectUrl
  },
  apply(oldState, newState) {
    return [/* method */ 'setObjectUrl', /* objectUrl */ newState.objectUrl]
  },
}

const renderVideoErrorMessage = {
  isEqual(oldState, newState) {
    return oldState.videoErrorMessage === newState.videoErrorMessage
  },
  apply(oldState, newState) {
    return [/* method */ 'setAudioErrorMessage', /* src */ newState.videoErrorMessage]
  },
}

const renderMediaSourceHandle = {
  isEqual(oldState, newState) {
    return oldState.mediaSourceId === newState.mediaSourceId
  },
  apply(oldState, newState) {
    return [/* method */ 'setMediaSourceId', /* mediaSourceId */ newState.mediaSourceId]
  },
}

export const render = [renderSrc, renderVideoErrorMessage, renderMediaSourceHandle]
