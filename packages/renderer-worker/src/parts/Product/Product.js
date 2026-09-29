import product from './Product.json' with { type: 'json' }

export const applicationName = 'lvce-oss'

export const productNameLong = 'Lvce Editor - OSS'

export const getApplicationName = () => {
  return applicationName
}

export const getProductNameLong = () => {
  return productNameLong
}

export const getBackendUrl = () => {
  return product.backendUrl
}
