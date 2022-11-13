declare const FileSystem: {
  readonly getTmpDir: (options?: {
    scheme?: 'memfs' | 'file'
  }) => Promise<string>
  readonly writeFile: (uri: string, content: string) => Promise<void>
  readonly mkdir: (uri: string) => Promise<void>
  readonly chmod: (uri: string, permissions: string) => Promise<void>
  /**
   * @deprecated use createExecutableFrom instead
   */
  readonly createExecutable: (content: string) => Promise<void>
  readonly createExecutableFrom: (path: string) => Promise<void>
}
