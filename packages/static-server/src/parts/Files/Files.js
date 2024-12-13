const indexHeaders = {
  'Content-Type': 'abc',
}

const specialHeaders = {
  'Content-Type': 'text/css',
}

const files = {
  '/': indexHeaders,
  '/def': specialHeaders,
  '/abc': specialHeaders,
}

export const get = (url) => {
  return files[url]
}

// TODO move etag into separate file
export const etag = 'W/123'
