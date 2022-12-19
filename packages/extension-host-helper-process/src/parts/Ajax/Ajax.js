import got from 'got'

export const getJson = async (url) => {
  const json = await got(url).json()
  return json
}
