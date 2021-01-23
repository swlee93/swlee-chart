interface RectInterface {
  x?: number
  y?: number
  w?: number
  h?: number
}

class Rect {
  private ctx: CanvasRenderingContext2D | null = null
  public x: number = 0
  public y: number = 0
  public w: number = 0
  public h: number = 0

  constructor(context: CanvasRenderingContext2D, { x = 0, y = 0, w = 0, h = 0 }: RectInterface) {
    if (context) {
      this.ctx = context
      this.x = x
      this.y = y
      this.w = w
      this.h = h

      this.ctx.beginPath()
      this.ctx.rect(x, y, w, h)
      this.ctx.closePath()
    }
  }
  public fill = () => {
    this.ctx?.fill()
  }
  public stroke = () => {
    this.ctx?.stroke()
  }
}

export default (context: CanvasRenderingContext2D, { x = 0, y = 0, w = 0, h = 0 }: RectInterface) =>
  new Proxy<any>(new Rect(context, { x, y, w, h }), {
    set: (target: any, prop: any, value: any) => {
      if (prop in target.ctx) {
        target.ctx[prop] = value
      } else {
        target[prop] = value
      }
      return true
    },
  })
