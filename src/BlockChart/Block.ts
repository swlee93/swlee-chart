import baseTheme, { ThemeAttrs } from '../theme'
import BlockChart, { INACTIVE_OUT, Data, Status } from '.'

export class Block {
  private parent: BlockChart
  private value: any
  public status: Status = 'normal'
  public pos: [number, number, number, number] = [0, 0, 0, 0]

  public data: Data
  public lastData?: Data
  public themeAttrs: ThemeAttrs = baseTheme
  private inactiveOut = 0

  // 컬러 변경 이펙트
  public prevStatus?: Status

  constructor(parent: BlockChart, data: Data, x: number, y: number, w: number, h: number) {
    this.parent = parent
    this.resizeBlock(x, y, w, h)
    this.data = data
    this.value = data.value
    this.setStatus()
  }

  public setStatus = () => {
    if (this.parent.thresholds) {
      const prevStatus = this.status
      this.status = this.parent.thresholds(this.data.value, this.data) || 'normal'
      if (prevStatus !== this.status) {
        this.render()
      }
    }
  }

  public updateData = (data: Data) => {
    if (data) {
      this.lastData = undefined
      const valueChange = data.value !== this.value
      if (this.status === 'unknown') {
        this.value = data.value
        if (this.parent.thresholds) {
          this.status = this.parent.thresholds(data.value, data) || 'normal'
        } else {
          this.status = 'normal'
        }
      } else if (valueChange) {
        this.value = data.value
        const prevStatus = this.status
        let nextStatus: Status = this.status
        if (this.parent.thresholds) {
          nextStatus = this.parent.thresholds(data.value, data) || 'normal'
        }

        if (prevStatus !== nextStatus) {
          this.prevStatus = prevStatus
          this.status = nextStatus
        }
      }
    } else if (!this.lastData) {
      this.lastData = this.data
      this.inactiveOut = 1
    } else {
      if (this.status !== 'unknown') {
        this.inactiveOut++
        if (this.inactiveOut >= INACTIVE_OUT) {
          this.status = 'unknown'
        }
      }
    }
    this.data = data
  }

  public resizeBlock = (x: number, y: number, w: number, h: number) => {
    this.pos = [x, y, w, h]
  }

  private fittingString(ctx: CanvasRenderingContext2D, str: string, maxWidth: number) {
    if (!str || !Number(maxWidth)) return ''
    var width = ctx.measureText(str).width
    var ellipsis = '…'
    var ellipsisWidth = ctx.measureText(ellipsis).width
    if (width <= maxWidth || width <= ellipsisWidth) {
      return str
    } else {
      var len = str.length
      while (width >= maxWidth - ellipsisWidth && len-- > 0) {
        str = str.substring(0, len)
        width = ctx.measureText(str).width
      }
      return str + ellipsis
    }
  }

  public render = () => {
    const ctx = this.parent.ctx
    const [x, y, w, h] = this.pos
    const valueVisible = typeof this.parent.valueVisible !== 'undefined' ? this.parent.valueVisible : true
    const hasValue = typeof this.data?.value !== 'undefined'
    const isHover = this.parent.hovering === this
    const getStatusColor = this.parent.getStatusColor

    if (this.status === 'unknown') return

    ctx.save()
    ctx.beginPath()
    if (isHover) ctx.globalAlpha = 1
    ctx.fillStyle = getStatusColor(this.status, this.value / this.parent.maxValue)
    ctx.rect(x + 1, y + 1, w - 1, h - 1)
    ctx.fill()

    if (hasValue && valueVisible && w > 30 && h > 20) {
      // 라벨링

      let fontSizeBase = w / 10
      if (fontSizeBase < 9) {
        fontSizeBase = 9
      } else if (fontSizeBase > 15) {
        fontSizeBase = 15
      }

      ctx.font = `${fontSizeBase}px Roboto`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.globalCompositeOperation = 'difference'
      ctx.fillStyle = getStatusColor(this.status)

      const value = this.parent.valueFormat ? this.parent.valueFormat(this.data.value) : this.data.value
      const label = this.data.label || ''
      const fitLabel = this.fittingString(ctx, label, w * 0.9)
      const centerX = x + w / 2
      const pad = fontSizeBase / 2
      const isEnoughHeight = fontSizeBase * 2 + pad * 5 < h
      if (fitLabel && isEnoughHeight) {
        // label과 value를 표시
        ctx.fillText(fitLabel, centerX, y + h * 0.33 - pad)

        ctx.font = `${fontSizeBase + pad}px Roboto`
        ctx.fillText(value, centerX, y + h * 0.66)
      } else if (fitLabel) {
        // label만 그릴 수 있는 높이
        ctx.fillText(fitLabel, centerX, y + h / 2)
      } else if (fontSizeBase < h) {
        // value만 그릴 수 있음
        ctx.fillText(value, centerX, y + h / 2)
      }

      // const width = ctx.measureText(value).width
    }

    ctx.closePath()
    ctx.restore()
  }
}

export default Block
