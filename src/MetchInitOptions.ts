export default class MetchInitOptions {
  baseURL: string
  timeout?: number
  headers?: Record<string, string>

  constructor(options: MetchInitOptions) {
    this.baseURL = options.baseURL ?? window.location.origin
    this.timeout = options.timeout
    this.headers = options.headers
  }
}
