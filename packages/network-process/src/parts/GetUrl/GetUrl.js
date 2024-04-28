import got from 'got'

export const getUrl = async ({ method, url }) => {
  const json = await got({ url, method })
  return json.url.toString()
}
