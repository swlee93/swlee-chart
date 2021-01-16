export const INACTIVE_OUT = 3

export type Status = 'inactive' | 'unknown' | 'error' | 'warning' | 'normal' | undefined
export interface ColorMeta {
  inactive?: string
  error?: string
  warning?: string
  normal?: string
  unknown?: string
}
export interface Data {
  value: number
  label: string
  id: string
  [key: string]: any
}

export type Datas = Array<Data>

import BlockChart from './BlockChart'

export default BlockChart
