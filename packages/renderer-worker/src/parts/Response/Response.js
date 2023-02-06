export const getText = (response) => {
  return response.text()
}

export const getJson = (response) => {
  return response.json()
}

export const create = (value, options) => {
  return new Response(value, options)
}
