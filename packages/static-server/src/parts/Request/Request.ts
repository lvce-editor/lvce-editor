export interface Request {
  readonly headers?: Readonly<Record<string, string | readonly string[] | undefined>>
  readonly method?: string
  readonly path?: string
  readonly url?: string
}
