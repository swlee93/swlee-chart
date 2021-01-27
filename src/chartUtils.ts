export const setCanvasDPI = (canvas: HTMLCanvasElement, ctx?: CanvasRenderingContext2D) => {
  const width = canvas.clientWidth
  const height = canvas.clientHeight
  const dpi = window.devicePixelRatio || 1
  if (dpi > 1) {
    canvas.width = width * dpi
    canvas.height = height * dpi
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    ctx.scale(dpi, dpi)
    return ctx
  } else {
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    ctx.scale(1, 1)
    return ctx
  }
}

// 다각형 안에 마우스가 들어있는지 확인.
export const inMouse = (positions: Array<Array<number>>, evt: MouseEvent) => {
  let cross = 0
  const length = positions.length
  for (let i = 0; i < length; i++) {
    const j = (i + 1) % length
    const pos = positions[i]
    const pos2 = positions[j]
    if (pos[1] > evt.offsetY !== pos2[1] > evt.offsetY) {
      const vis = ((pos2[0] - pos[0]) * (evt.offsetY - pos[1])) / (pos2[1] - pos[1]) + pos[0]

      if (evt.offsetX < vis) {
        cross++
      }
    }
  }

  return cross % 2 > 0
}

export const inMouseOnRect = (rect: [number, number, number, number] = [0, 0, 0, 0], evt: any) => {
  const [x, y, w, h] = rect
  const isIn = x < evt.offsetX && x + w >= evt.offsetX && y < evt.offsetY && y + h >= evt.offsetY
  console.log('inMouseOnRect', isIn, evt.offsetX, evt.offsetY, [x, y, w, h])
  return isIn
}

export const hex2rgba = (hex = '', alpha = 1) => {
  const hexMatch = hex.match(/\w\w/g)
  if (hexMatch) {
    const [r, g, b] = hexMatch.map((x) => parseInt(x, 16))
    return `rgba(${r},${g},${b},${alpha})`
  } else {
    return hex
  }
}
