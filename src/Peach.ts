import { get, isObject } from './helpers'
import PeachInitOptions from './PeachInitOptions'

class Peach {
  public options: PeachInitOptions
  public url: URL
  private requestKey: string = ''
  private queue: Map<string, AbortController> = new Map()
  private requestInit: RequestInit = {}
  private transformCallback: (response: any) => any = response => response

  constructor(options?: PeachInitOptions) {
    this.options = new PeachInitOptions(options)
    if (this.options.baseURL) {
      this.url = new URL(this.options.baseURL)
    }
  }

  path(path: string): Omit<this, 'path'> {
    const { baseURL } = this.options
    this.url = baseURL ? new URL(path, baseURL) : new URL(path, window.location.origin)
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

  query(params: { [key: string]: any }): Omit<this, 'query'> {
    const paramKeysOrderedAlphabetically = Object.keys(params)
      .filter(key => typeof params[key] !== 'undefined')
      .filter((key) => {
        return Array.isArray(params[key]) ? params[key].length : params[key]
      })
      .sort()

    paramKeysOrderedAlphabetically.forEach((key) => {
      if (typeof params[key] === 'object') {
        Object.keys(params[key]).forEach((subkey) => {
          const value = params[key][subkey]
          this.url.searchParams.set(`${key}[${subkey}]`, value)
        })
      }
      else {
        this.url.searchParams.set(key, params[key])
      }
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

  async get<T>(key?: string): Promise<T> {
    this.requestInit.method = 'GET'

    const response = await this.doFetch()

    if (key) {
      return get(response, key)
    }

    return response
  }

  async post<T>(payload: any): Promise<T> {
    this.requestInit.method = 'POST'
    this.requestInit.body = payload

    return this.doFetch()
  }

  async put<T>(payload: any): Promise<T> {
    this.requestInit.method = 'PUT'
    this.requestInit.body = payload

    return this.doFetch()
  }

  async delete<T>(id?: string): Promise<T> {
    this.requestInit.method = 'DELETE'

    if (id) {
      this.path(id)
    }

    return this.doFetch()
  }

  async patch<T>(payload: any, id?: string): Promise<T> {
    this.requestInit.method = 'PATCH'
    this.requestInit.body = payload

    if (id) {
      this.path(id)
    }

    return this.doFetch()
  }
}

export default {
  create(options?: PeachInitOptions) {
    return new Peach(options)
  },
}
