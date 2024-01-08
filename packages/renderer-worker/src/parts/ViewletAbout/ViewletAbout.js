import * as Command from '../Command/Command.js'
import * as GetAboutDetailStringWeb from '../GetAboutDetailStringWeb/GetAboutDetailStringWeb.js'
import * as Product from '../Product/Product.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const create = () => {
  return {
    productName: '',
    message: '',
  }
}

export const loadContent = async (state) => {
  const message = GetAboutDetailStringWeb.getDetailStringWeb()
  return {
    ...state,
    productName: Product.productNameLong,
    message,
  }
}

export const handleClickOk = async (state) => {
  await Viewlet.closeWidget(ViewletModuleId.About)
  return state
}

export const handleClickCopy = async (state) => {
  const { message } = state
  await Command.execute('ClipBoard.writeText', message)
  return state
}

export const handleClickClose = async (state) => {
  await Viewlet.closeWidget(ViewletModuleId.About)
  return state
}
