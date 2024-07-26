export default class PeachInitOptions {
  baseURL: string
  timeout?: number
  headers?: Record<string, string>

  constructor(options: PeachInitOptions) {
    this.baseURL = options.baseURL ?? window.location.origin
    this.timeout = options.timeout
    this.headers = options.headers
  }
}
