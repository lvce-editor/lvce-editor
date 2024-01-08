import * as GetAboutDetailStringWeb from '../GetAboutDetailStringWeb/GetAboutDetailStringWeb.js'

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
    productName: 'Lvce Editor',
    message,
  }
}
