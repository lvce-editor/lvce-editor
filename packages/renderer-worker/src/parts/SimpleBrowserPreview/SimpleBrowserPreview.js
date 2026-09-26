import * as HtmlPreviewUrl from '../HtmlPreviewUrl/HtmlPreviewUrl.js'
import * as Id from '../Id/Id.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'
import * as ViewletModule from '../ViewletModule/ViewletModule.js'

export const getBounds = ({ x, y, width, height, headerHeight }) => ({ x, y: y + headerHeight, width, height: Math.max(0, height - headerHeight) })

export const materialize = async (state, tab) => {
  if (tab.previewUid) return tab
  const uid = Id.create()
  const commands = await ViewletManager.load({
    type: 0,
    id: 'Preview',
    uid,
    uri: HtmlPreviewUrl.decode(tab.iframeSrc),
    parentUid: state.uid,
    show: false,
    getModule: ViewletModule.load,
    ...getBounds(state),
  })
  await RendererProcess.invoke('Viewlet.sendMultiple', commands)
  return { ...tab, previewUid: uid }
}

export const dispose = (tab) => (tab.previewUid ? Viewlet.dispose(tab.previewUid) : undefined)

export const resize = async (state) => {
  const commands = await Promise.all(state.tabs.filter((tab) => tab.previewUid).map((tab) => Viewlet.resize(tab.previewUid, getBounds(state))))
  if (commands.length) await RendererProcess.invoke('Viewlet.sendMultiple', commands.flat())
}

export const reload = async (tab) => {
  if (tab.previewUid) await Viewlet.executeViewletCommand(tab.previewUid, 'setUri', HtmlPreviewUrl.decode(tab.iframeSrc))
}
