export const uid = (prefix: string | number = 'root') => {
  return `${prefix}_${Math.random().toString(16).split('.')[1]}`
}

export const DEFAULT_DATUM = {
  name: 'default',
  value: 0,
  group: 'none',
}
