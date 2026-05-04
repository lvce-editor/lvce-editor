const indexHeaders = {
  'Content-Type': 'abc',
  Etag: 'W/123',
}

const specialHeaders = {
  'Content-Type': 'text/css',
  Etag: 'W/123',
}

const files = {
  '/': {
    headers: indexHeaders,
  },
  '/def': {
    headers: specialHeaders,
  },
  '/abc': {
    headers: specialHeaders,
  },
}

export const get = (url) => {
  return files[url]
}

// TODO move etag into separate file
export const etag = 'W/123'
