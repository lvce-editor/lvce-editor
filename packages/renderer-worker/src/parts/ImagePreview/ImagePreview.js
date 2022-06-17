import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as FileSystem from '../FileSystem/FileSystem.js'

export const state = {
  uri: '',
  versionId: 0,
}

const WIDTH = 170 // TODO how to keep in sync with css?
const SPACE = 10
const TRIANGLE_OFFSET_TOP = 22
const TRIANGLE_HEIGHT = 22
const TREE_ITEM_HEIGHT = 22
const TOP = TRIANGLE_OFFSET_TOP + (TREE_ITEM_HEIGHT - TRIANGLE_HEIGHT) / 2

export const show = async (uri, top, left) => {
  try {
    const version = ++state.versionId
    // TODO what to do on web? probably need to create blob url
    // or use https url for external images
    const blobUrl = await FileSystem.getBlobUrl(uri)
    if (version !== state.versionId) {
      return
    }
    await RendererProcess.invoke(
      /* Viewlet.hydrate */ 3028,
      /* id */ 'ImagePreview',
      /* imageUrl */ blobUrl,
      /* top */ top - TOP,
      /* left */ left - WIDTH - SPACE
    )
  } catch (error) {
    console.error(error)
    await RendererProcess.invoke(
      /* Viewlet.hydrate */ 3028,
      /* id */ 'ImagePreview',
      /* message */ 'Image could not be loaded',
      /* top */ top - TOP,
      /* left */ left - WIDTH - SPACE
    )
  }
}

export const hide = async () => {
  ++state.versionId
  await RendererProcess.invoke(
    /* Viewlet.dispose */ 3026,
    /* id */ 'ImagePreview'
  )
}
