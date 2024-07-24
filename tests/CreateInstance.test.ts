import { describe, expect, it } from 'vitest'
import mula from '../src'

describe('HTTP Client', () => {
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
      timeout
    })
    expect(client.options).toHaveProperty('timeout', timeout)
  })

  it('creates an instance with custom headers', () => {
    const headers = {
      'content-type': 'application/json'
    }

    const client = mula.create({
      headers
    })

    expect(client.options).toHaveProperty('headers', headers)
  })
})