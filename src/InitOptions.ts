export interface MulaInitOptions {
  baseURL?: string
  timeout?: number
  headers?: Record<string, string>
}

export default class InitOptions {
  baseURL: string
  timeout?: number
  headers?: Record<string, string>

  constructor(options: MulaInitOptions) {
    this.baseURL = options.baseURL ?? window.location.origin
    this.timeout = options.timeout
    this.headers = options.headers
  }
}
