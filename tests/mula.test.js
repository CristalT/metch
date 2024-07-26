import { beforeEach, describe, expect, it } from 'vitest'
import metch from 'metch'

describe('metch http Client', () => {
  describe('initialization', () => {
    it('creates an instance with custom baseURL', () => {
      const baseURL = 'https://some-domain.com/api'

      const client = metch.create({
        baseURL,
      })

      expect(client.options).toHaveProperty('baseURL', baseURL)
    })

    it('creates an instance with custom timeout', () => {
      const timeout = 1000

      const client = metch.create({
        timeout,
      })
      expect(client.options).toHaveProperty('timeout', timeout)
    })

    it('creates an instance with custom headers', () => {
      const headers = {
        'content-type': 'application/json',
      }

      const client = metch.create({
        headers,
      })

      expect(client.options).toHaveProperty('headers', headers)
    })
  })

  describe('requests', () => {
    const baseURL = 'https://some-domain.com'

    let client

    beforeEach(() => {
      fetch.resetMocks()

      client = metch.create({
        baseURL,
      })
    })

    it('gets data', async () => {
      fetch.mockResponse(JSON.stringify({ data: 'test' }))

      await client.get()

      expect(fetch.requests().length).toEqual(1)
      expect(fetch.requests()[0].url).toEqual(`${baseURL}/`)
      expect(fetch.requests()[0].method).toEqual('GET')
    })

    it('gets data from custom path', async () => {
      fetch.mockResponse(JSON.stringify({ data: 'test' }))

      const path = 'api/v1'
      await client.path(path).get()

      expect(fetch.requests().length).toEqual(1)
      expect(fetch.requests()[0].url).toEqual(`${baseURL}/${path}`)
      expect(fetch.requests()[0].method).toEqual('GET')
    })

    it('gets data from specific object key', async () => {
      fetch.mockResponse(JSON.stringify({ data: { heros: { name: 'Batman' } } }))

      const response = await client.path('api').get('data.heros.name')

      expect(response).toEqual('Batman')
    })

    it('transform response data', async () => {
      fetch.mockResponse(JSON.stringify({ data: { heros: { name: 'Batman' } } }))

      const response = await client.transform(response => response.data.heros).get()
      expect(response).toEqual({ name: 'Batman' })
    })

    it('performs a cancellable request', async () => {
      fetch.mockResponse(JSON.stringify({ data: { heros: { name: 'Batman' } } }))

      client.cancellable('cancellableRequestTest').get('data')

      expect(fetch.requests()[0]).toHaveProperty('signal', client.getController().signal)
    })

    it ('makes a post request', async () => {
      fetch.mockResponse(JSON.stringify({ data: 'ok' }))

      const payload = { name: 'Bruce Wayne' }
      const response = await client.post(payload)
      const url = new URL(baseURL)

      expect(response).toHaveProperty('data', 'ok')
      expect(fetch).toBeCalledWith(url, { body: payload, method: 'POST' })
    })

    it ('makes a put request', async () => {
      fetch.mockResponse(JSON.stringify({ data: 'ok' }))

      const response = await client.put({ name: 'Bruce Wayne' })

      expect(response).toHaveProperty('data', 'ok')

      const url = new URL(baseURL)

      expect(fetch).toBeCalledWith(url, { method: 'PUT', body: { name: 'Bruce Wayne' } })
    })

    it ('makes a delete request where its id is passed throw the path method', async () => {
      fetch.mockResponse(JSON.stringify({ data: 'ok' }))

      const response = await client.path('123').delete()

      expect(response).toHaveProperty('data', 'ok')
      expect(fetch.requests()[0].url).toEqual(`${baseURL}/123`)
      expect(fetch.requests()[0].method).toEqual('DELETE')
    })

    it ('makes a delete request where its id is passed throw the delete method', async () => {
      fetch.mockResponse(JSON.stringify({ data: 'ok' }))

      const response = await client.delete('123')

      expect(response).toHaveProperty('data', 'ok')
      expect(fetch.requests()[0].url).toEqual(`${baseURL}/123`)
      expect(fetch.requests()[0].method).toEqual('DELETE')
    })

    it ('makes a patch request', async () => {
      fetch.mockResponse(JSON.stringify({ data: 'ok' }))

      const response = await client.path('123').patch({ name: 'Batman' })

      const url = new URL('123', baseURL)

      expect(response).toHaveProperty('data', 'ok')
      expect(fetch).toBeCalledWith(url, { method: 'PATCH', body: { name: 'Batman' } })
    })

    it ('makes a patch request with id', async () => {
      fetch.mockResponse(JSON.stringify({ data: 'ok' }))

      const response = await client.patch({ name: 'Batman' }, '123')

      const url = new URL('123', baseURL)

      expect(response).toHaveProperty('data', 'ok')
      expect(fetch).toBeCalledWith(url, { method: 'PATCH', body: { name: 'Batman' } })
    })
    describe('query parameters', () => {
      it ('requests with query parameters', async () => {
        fetch.mockResponse(JSON.stringify([{ data: 'ok' }]))

        const response = await client.query({ limit: 1 }).get('0.data')

        expect(response).toBe('ok')
        expect(fetch.requests()[0].url).toEqual(`${baseURL}/?limit=1`)
      })
      it ('requests with advanced query parameters', async () => {
        fetch.mockResponse(JSON.stringify([{ data: 'ok' }]))

        const response = await client.query({ limit: 1, fields: ['name', 'last'] }).get('0.data')

        expect(response).toBe('ok')
        expect(fetch.requests()[0].url).toEqual(`${baseURL}/?limit=1&fields=name%2Clast`)
      })
    })
  })
})
