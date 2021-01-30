export const getContextWithDPI = (canvas: HTMLCanvasElement) => {
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

export const isMouseOnRect = (rect: [number, number, number, number] = [0, 0, 0, 0], evt: any) => {
  const [x, y, w, h] = rect
  return x < evt.offsetX && x + w >= evt.offsetX && y < evt.offsetY && y + h >= evt.offsetY
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
