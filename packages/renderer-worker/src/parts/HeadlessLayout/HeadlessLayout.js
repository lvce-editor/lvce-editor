import * as Id from '../Id/Id.js'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'
import * as ViewletModule from '../ViewletModule/ViewletModule.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const initialize = async (initData) => {
  const uid = Id.create()
  const viewlet = {
    disposed: false,
    focus: false,
    getModule: ViewletModule.load,
    id: ViewletModuleId.Layout,
    render: false,
    shouldRenderEvents: false,
    show: false,
    type: 0,
    uid,
    uri: '',
  }
  await ViewletManager.load(viewlet, false, false, { ...initData, restore: false })
}
