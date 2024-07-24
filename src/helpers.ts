export function get(val: { [key: string]: any }, key: string | number) {
  if (key === '') return val;
  if (!val || typeof val !== 'object') throw new Error('Cannot get a key from a non object value.');

  let result: any = undefined;

  String(key)
    .split('.')
    .forEach((k) => {
      if (!result) result = val[k];
      else result = result[k];

    });

  return result;
};