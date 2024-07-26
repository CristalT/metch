import { describe, expect, it } from 'vitest'
import { get } from 'peach/helpers'

describe('helpers', () => {
  describe('get', () => {
    it('gets an object value acording to a given path', () => {
      const obj = { data: { name: 'Batman' } }
      expect(get(obj, 'data.name')).toBe('Batman')
    })

    it('gets an array value acording to a given path', () => {
      const arr = ['Bruce', 'Wayne']
      expect(get(arr, 1)).toBe('Wayne')
    })
  })
})
