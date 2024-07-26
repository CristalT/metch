import { get } from './helpers'
import MetchInitOptions from './MetchInitOptions'

class Metch {
  public options: MetchInitOptions
  public url: URL
  private requestKey: string = ''
  private queue: Map<string, AbortController> = new Map()
  private requestInit: RequestInit = {}
  private transformCallback: (response: any) => any = response => response

  constructor(options: MetchInitOptions) {
    this.options = new MetchInitOptions(options)
    this.url = new URL(this.options.baseURL ?? window.location.origin)
  }

  path(path: string): Omit<this, 'path'> {
    this.url = new URL(path, this.options.baseURL ?? window.location.origin)
    return this
  }

  transform(cb: () => any): Omit<this, 'transform'> {
    this.transformCallback = cb
    return this
  }

  cancellable(key: string | string[]): Omit<this, 'cancellable'> {
    this.requestKey = Array.isArray(key) ? JSON.stringify(key) + this.url.href : key + this.url.href

    if (this.queue.has(this.requestKey)) {
      const prevReq = this.queue.get(this.requestKey)
      prevReq?.abort()
    }

    this.queue.set(this.requestKey, new AbortController())

    return this
  }

  getController(): AbortController | undefined {
    return this.queue.get(this.requestKey)
  }

  query(params: object): Omit<this, 'query'> {
    Object.entries(params).forEach(([key, value]) => {
      this.url.searchParams.append(key, value)
    })
    return this
  }

  private async doFetch() {
    const controller = this.getController()
    if (controller) {
      this.requestInit.signal = controller.signal
    }

    const request = fetch(this.url, this.requestInit)
    const response = await request.then(response => response.json())

    return this.transformCallback(response)
  }

  async get(key?: string) {
    this.requestInit.method = 'GET'

    const response = await this.doFetch()

    if (key) {
      return get(response, key)
    }

    return response
  }

  async post(payload: any) {
    this.requestInit.method = 'POST'
    this.requestInit.body = payload

    return this.doFetch()
  }

  async put(payload: any) {
    this.requestInit.method = 'PUT'
    this.requestInit.body = payload

    return this.doFetch()
  }

  async delete(id?: string) {
    this.requestInit.method = 'DELETE'

    if (id) {
      this.url = new URL(id, this.options.baseURL)
    }

    return this.doFetch()
  }

  async patch(payload: any, id?: string) {
    this.requestInit.method = 'PATCH'
    this.requestInit.body = payload

    if (id) {
      this.url = new URL(id, this.options.baseURL)
    }

    return this.doFetch()
  }
}

export default {
  create(options: MetchInitOptions) {
    return new Metch(options)
  },
}
