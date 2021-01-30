export type IDatum<Custom> = {
  children?: Array<IDatum<Custom>>
  value: number
  length?: number
} & Custom

export type Input<Custom> = {
  value: number
  children?: Array<Input<Custom>>
} & Custom

export default function <Custom>(
  data: Array<Input<Custom>>,
  container: { x0: number; y0: number; x1: number; y1: number },
  option?: { depth?: number; valueKey?: keyof IDatum<Custom> },
): Array<ILayoutRect<Custom>> {
  const x0 = container.x0
  const y0 = container.y0
  const x1 = container.x1
  const y1 = container.y1

  const input = {
    x0,
    y0,
    x1,
    y1,
    children: data,
  } as ILayoutRect<Custom>

  console.log('data, container, option', data, container, option)
  return recurse(input, option, 0)
}

export type INormalizedDatum<Custom> = IDatum<Custom> & {
  // this is the value after going through `normalizeData` function
  // normalizedValue: number
}
export interface IRect {
  // Top-left corner:
  x0: number
  y0: number
  // Bottom right corner:
  x1: number
  y1: number
}
export type ILayoutRect<T> = IRect & INormalizedDatum<T>

export const recurse = <Custom>(
  datum: ILayoutRect<Custom>,
  option: { depth?: number; valueKey?: keyof IDatum<Custom> } = {},
  depthCount: number = 0,
): Array<ILayoutRect<Custom>> => {
  let nodes: Array<ILayoutRect<Custom>> = []
  const { x0, x1, y0, y1, children = [], length } = datum
  const parentLength = children.reduce((acc, { length }) => acc + (length || 0), 0)
  const height = y1 - y0
  let heightAcc = 0
  let widthAcc = 0
  children.map((child) => {
    const { length: childLength = 0, children: childChildren, ...rest } = child
    const childHeight = height * (childLength / parentLength)
    const childWidth = 50
    const childLayout = {
      x0: x0,
      x1: x0 + childWidth,
      y0: y0 + heightAcc,
      y1: y0 + heightAcc + childHeight,
    }
    heightAcc += childHeight

    nodes.push({ ...child, ...childLayout })
  })
  return nodes
}
