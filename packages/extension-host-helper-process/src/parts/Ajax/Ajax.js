import got from 'got'

export const getJson = async (url) => {
  const json = await got(url, {
    retry: {
      limit: 0,
    },
  }).json()
  return json
}
