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
  '/auth/callback': {
    headers: indexHeaders,
  },
  '/def': {
    headers: specialHeaders,
  },
  '/abc': {
    headers: specialHeaders,
  },
}

export const get = (url: string): StaticFile | undefined => {
  return files[url]
}

// TODO move etag into separate file
export const etag = 'W/123'
