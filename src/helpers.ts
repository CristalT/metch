export function get(val: { [key: string]: any }, key: string | number) {
  if (key === '') {
    return val
  }
  if (!val || typeof val !== 'object') {
    throw new Error('Cannot get a key from a non object value.')
  }

  let result: any

  String(key)
    .split('.')
    .forEach((k) => {
      if (!result)
        result = val[k]
      else result = result[k]
    })

  return result
};

export function isObject(value) {
  return typeof value === 'object'
    && value !== null
    && !Array.isArray(value)
    && !(value instanceof RegExp)
    && !(value instanceof Date)
    && !(value instanceof Set)
    && !(value instanceof Map)
}
