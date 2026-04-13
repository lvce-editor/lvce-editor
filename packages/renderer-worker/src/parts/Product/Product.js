import product from './Product.json' with { type: 'json' }

export const productNameLong = 'Lvce Editor - OSS'

export const getProductNameLong = () => {
  return productNameLong
}

export const getBackendUrl = () => {
  return product.backendUrl
}
