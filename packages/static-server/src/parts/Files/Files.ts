const indexHeaders = {
  'Content-Type': 'abc',
  Etag: 'W/123',
}

const specialHeaders = {
  'Content-Type': 'text/css',
  Etag: 'W/123',
}

interface StaticFile {
  readonly etag?: string
  readonly headers: Readonly<Record<string, string>>
}

const files: Readonly<Record<string, StaticFile>> = {
  '/': {
    headers: indexHeaders,
  },
  '/abc': {
    headers: specialHeaders,
  },
  '/auth/callback': {
    headers: indexHeaders,
  },
  '/board': {
    headers: indexHeaders,
  },
  '/chat': {
    headers: indexHeaders,
  },
  '/def': {
    headers: specialHeaders,
  },
}

export const get = (url: string): StaticFile | undefined => {
  return files[url]
}

// TODO move etag into separate file
export const etag = 'W/123'
