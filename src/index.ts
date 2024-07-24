import { get } from "./helpers";
import type { MulaInitOptions } from "./InitOptions";
import InitOptions from "./InitOptions";

class Mula {
  public options: MulaInitOptions
  public url: URL
  private requestKey: string
  private queue: Map<string, AbortController> = new Map()

  create(options: MulaInitOptions): Omit<this, 'create'> {
    this.options = new InitOptions(options)
    this.url = new URL(this.options.baseURL ?? window.location.origin)
    return this;
  }

  path(path: string): Omit<this, 'path'> {
    this.url = new URL(path, this.options.baseURL ?? window.location.origin)
    return this
  }

  cancellable(key: string | string[]): Omit<this, 'cancellable'> {
    this.requestKey = Array.isArray(key) ? JSON.stringify(key) + this.url.href : key + this.url.href

    if (this.queue.has(this.requestKey)) {
      const prevReq = this.queue.get(this.requestKey)
      prevReq?.abort()
    }

    this.queue.set(this.requestKey, new AbortController)

    return this
  }

  async get(key?: string) {
    const response = await fetch(this.url, {
      method: 'GET',
      signal: this.queue.get(this.requestKey)?.signal
    }).then(response => response.json())

    if (key) return get(response, key)

    return response
  }
}

export default new Mula;