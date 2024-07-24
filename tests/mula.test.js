import { beforeEach, describe, expect, it } from 'vitest'
import mula from 'mula'

describe('mula http Client', () => {
  describe('initialization', () => {
    it('creates an instance with custom baseURL', () => {
      const baseURL = 'https://some-domain.com/api'

      const client = mula.create({
        baseURL,
      })

      expect(client.options).toHaveProperty('baseURL', baseURL)
    })

    it('creates an instance with custom timeout', () => {
      const timeout = 1000

      const client = mula.create({
        timeout,
      })
      expect(client.options).toHaveProperty('timeout', timeout)
    })

    it('creates an instance with custom headers', () => {
      const headers = {
        'content-type': 'application/json',
      }

      const client = mula.create({
        headers,
      })

      expect(client.options).toHaveProperty('headers', headers)
    })
  })

  describe('crud methods', () => {
    const baseURL = 'https://some-domain.com'

    let client

    beforeEach(() => {
      fetch.resetMocks()

      client = mula.create({
        baseURL,
      })
    })

    it('gets data', async () => {
      fetch.mockResponse(JSON.stringify({ data: 'test' }))
      const url = new URL(baseURL)

      const response = await client.get()

      expect(fetch).toBeCalledWith(url, { method: 'GET' })
      expect(response).toHaveProperty('data', 'test')
    })

    it('gets data from custom path', async () => {
      fetch.mockResponse(JSON.stringify({ data: 'test' }))

      const path = 'api/v1'
      const url = new URL(path, baseURL)

      const response = await client.path(path).get()

      expect(fetch).toBeCalledWith(url, { method: 'GET' })
      expect(response).toHaveProperty('data', 'test')
    })

    it('gets data from specific object key', async () => {
      fetch.mockResponse(JSON.stringify({ data: { heros: { name: 'Batman' } } }))

      const response = await client.path('api').get('data.heros.name')

      expect(response).toEqual('Batman')
    })

    it('performs a cancellable request', async () => {
      const mock = fetch.mockResponse(JSON.stringify({ data: { heros: { name: 'Batman' } } }))

      await client.cancellable('cancellableRequestTest').get('data')

      const url = new URL(baseURL)

      expect(mock).toBeCalledWith(url, { signal: client.getController().signal, method: 'GET' })
    })

    it ('makes a post request', async () => {
      const mock = fetch.mockResponse(JSON.stringify({ data: 'ok' }))

      const response = await client.post({ name: 'Bruce Wayne' })

      expect(response).toHaveProperty('data', 'ok')

      const url = new URL(baseURL)

      expect(mock).toBeCalledWith(url, { method: 'POST', body: { name: 'Bruce Wayne' } })
    })

    it ('makes a put request', async () => {
      const mock = fetch.mockResponse(JSON.stringify({ data: 'ok' }))

      const response = await client.put({ name: 'Bruce Wayne' })

      expect(response).toHaveProperty('data', 'ok')

      const url = new URL(baseURL)

      expect(mock).toBeCalledWith(url, { method: 'PUT', body: { name: 'Bruce Wayne' } })
    })

    it ('makes a delete request where its id is passed throw the path method', async () => {
      const mock = fetch.mockResponse(JSON.stringify({ data: 'ok' }))

      const response = await client.path('123').delete()

      expect(response).toHaveProperty('data', 'ok')

      const url = new URL('123', baseURL)

      expect(mock).toBeCalledWith(url, { method: 'DELETE' })
    })

    it ('makes a delete request where its id is passed throw the delete method', async () => {
      const mock = fetch.mockResponse(JSON.stringify({ data: 'ok' }))

      const response = await client.delete('123')

      expect(response).toHaveProperty('data', 'ok')

      const url = new URL('123', baseURL)

      expect(mock).toBeCalledWith(url, { method: 'DELETE' })
    })

    it ('makes a patch request', async () => {
      const mock = fetch.mockResponse(JSON.stringify({ data: 'ok' }))

      const response = await client.path('123').patch({ name: 'Batman' })

      expect(response).toHaveProperty('data', 'ok')

      const url = new URL('123', baseURL)

      expect(mock).toBeCalledWith(url, { method: 'PATCH', body: { name: 'Batman' } })
    })

    it ('makes a patch request with id', async () => {
      const mock = fetch.mockResponse(JSON.stringify({ data: 'ok' }))

      const response = await client.patch({ name: 'Batman' }, '123')

      expect(response).toHaveProperty('data', 'ok')

      const url = new URL('123', baseURL)

      expect(mock).toBeCalledWith(url, { method: 'PATCH', body: { name: 'Batman' } })
    })
    describe('parameters', () => {
      it ('requests with query parameters', async () => {
        const mock = fetch.mockResponse(JSON.stringify([{ data: 'ok' }]))

        const response = await client.query({ limit: 1 }).get('0.data')

        const url = new URL(baseURL)
        url.searchParams.append('limit', '1')

        expect(mock).toBeCalledWith(url, { method: 'GET' })
        expect(response).toBe('ok')
      })
    })
  })
})
