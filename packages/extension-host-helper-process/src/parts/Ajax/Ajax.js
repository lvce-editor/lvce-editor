import got from 'got'

/**
 * @deprecated use node api directly
 */
export const getJson = async (url) => {
  const json = await got(url, {
    retry: {
      limit: 0,
    },
  }).json()
  return json
}
