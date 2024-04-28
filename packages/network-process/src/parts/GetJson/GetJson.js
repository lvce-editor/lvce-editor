import got from 'got'

export const getJson = async ({ method, url }) => {
  const json = await got({ url, method })
  return json
}
