import { beforeEach, describe, expect, it, vi } from "vitest";
import mula from '../src'

function mockFetch<T>(mockResponse: T) {
  window.fetch = vi.fn().mockImplementationOnce(() => {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    })
  })

  return vi.spyOn(window, 'fetch')
}

describe('Mula', () => {

  const baseURL = 'https://some-domain.com'

  const client = mula.create({
    baseURL
  })

  it('gets data', async () => {
    const fetch = mockFetch({ data: 'test' })
    const url = new URL(baseURL)

    const response = await client.get()

    expect(fetch).toBeCalledWith(url, { method: 'GET' })
    expect(response).toHaveProperty('data', 'test')
  })

  it('gets data from custom path', async () => {
    const fetch = mockFetch({ data: 'test' })
    const path = 'api/v1'
    const url = new URL(path, baseURL)

    const response = await client.path(path).get()

    expect(fetch).toBeCalledWith(url, { method: 'GET' })
    expect(response).toHaveProperty('data', 'test')
  })

  it('gets data from specific object key', async () => {
    mockFetch({ data: { heros: { name: 'Batman' } } })

    const response = await client.path('api').get('data.heros.name')

    expect(response).toEqual('Batman')
  })

  it('performs a cancellable request', async () => {
    
  })
})