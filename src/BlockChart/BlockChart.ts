import { setCanvasDPI, inMouseOnRect, hex2rgba } from '../chartUtils'
import Tooltip, * as TD from '../chartTooltip'
import baseTheme, { ThemeAttrs } from '../theme'

const INACTIVE_OUT = 3

/**
 * inactive => 죽은 상태, 회색
 * unknown => 알 수 없음, 빈칸
 * error => 빨강
 * warning => 주황
 * normal => 파랑 (기본)
 * undefined is normal 무소식 is 희소식
 */

export type Status = 'inactive' | 'unknown' | 'error' | 'warning' | 'normal' | undefined

export interface ColorMeta {
  inactive?: string
  error?: string
  warning?: string
  normal?: string
  unknown?: string
}

interface Data {
  value: number
  label: string
  id: string
  [key: string]: any
}

type Datas = Array<Data>

const getTooltip = (block: Block, format?: Function) => {
  const { data, lastData, status } = block
  const dom = document.createElement('div')

  const drawBody = (data: Data) => {
    if (format) {
      const formatData = format(data)
      if (typeof formatData === 'object') {
        dom.appendChild(formatData)
      } else {
        const div = document.createElement('div')
        div.innerHTML = format(data)
        dom.appendChild(div)
      }
    } else {
      dom.appendChild(TD.getStrongText(`${data.value}`))
    }
  }

  if (lastData) {
    dom.appendChild(TD.getTitleText(lastData.label))
    if (status !== 'unknown') {
      drawBody(lastData)
    }
  } else {
    dom.appendChild(TD.getTitleText(data.label))
    drawBody(data)
  }
  return dom
}

/**
 * 육각형 객체 하나
 */
class Block {
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

    if (parent.thresholds) {
      this.status = parent.thresholds(data.value, data) || 'normal'
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
      ctx.fillStyle = this.themeAttrs.bg_font_color

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
/**
 * 전체 육각형
 */
interface Option {
  fixedMaxValue?: number
  mouseHoverCallback?: Function
}
class BlockChart {
  private canvas: HTMLCanvasElement
  // @ts-ignore
  public ctx: CanvasRenderingContext2D
  public width: number = 0
  public height: number = 0
  public themeAttrs: ThemeAttrs = baseTheme
  public colorMeta?: ColorMeta

  public x: number = 0
  public y: number = 0

  public hovering?: Block

  public dataIds: Array<string> = []
  public blocks: { [key: string]: Block } = {}

  private datas: Datas = []
  public maxValue: number = 0
  private fixedMaxValue: number = 0
  private jsonDatas: { [key: string]: Data } = {}
  private prevDataIds: Array<string> = []
  // Options
  public hasSort?: boolean
  public thresholds?: (value: number, rowData: any) => Status
  public valueVisible?: boolean
  public valueFormat?: Function
  public onClick?: Function
  private tooltip: Tooltip
  public format?: Function
  private mouseHoverCallback?: Function = undefined

  constructor(canvas: HTMLCanvasElement, option: Option) {
    this.canvas = canvas
    this.resizeEvent()
    canvas.addEventListener('click', this.mouseClickEvent)
    canvas.addEventListener('mousemove', this.mouseHoverEvent)
    canvas.addEventListener('mouseleave', this.mouseLeaveEvent)
    this.tooltip = new Tooltip()
    this.fixedMaxValue = option?.fixedMaxValue || 0
    this.mouseHoverCallback = option?.mouseHoverCallback
  }

  public draw = () => {
    const { ctx } = this
    ctx.clearRect(0, 0, this.width, this.height)
    ctx.save()
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    if (this.hovering) this.ctx.globalAlpha = 0.4

    this.dataIds.forEach((id) => {
      const block = this.blocks[id]
      block.render()
    })

    if (this.hovering) this.ctx.globalAlpha = 1

    ctx.restore()
  }

  public setTheme = (theme: ThemeAttrs) => {
    this.themeAttrs = theme
    this.dataIds.forEach((id) => {
      const block = this.blocks[id]
      block.themeAttrs = theme
    })
  }

  // clear 는 데이터 비워진 부분을 지울지 여부 기본으로 데이터 비워진 부분은 지우지 않고 빈칸으로 남겨둔다
  public loadData = (datas: Datas, clear: boolean = false) => {
    this.datas = datas
    this.jsonDatas = {}

    this.prevDataIds = [...this.dataIds]
    let maxValue = 0
    this.dataIds = this.datas.reduce<any[]>((acc, d) => {
      if (d.id) {
        acc.push(d.id)
      }
      return acc
    }, [])
    this.datas.forEach((d, idx) => {
      if (typeof d.id === 'undefined') return
      this.jsonDatas[d.id] = d

      // 업데이트 데이터를 더하는 방식
      // if (this.dataIds.indexOf(d.id) === -1) {
      //   this.dataIds.push(d.id)
      // }
      if (maxValue < d.value) {
        maxValue = d.value
      }
    })
    this.maxValue = this.fixedMaxValue || maxValue
    this.setAttribute()
    this.draw()

    if (this.tooltip.tooltipStat && this.hovering) {
      this.tooltip.changeText(getTooltip(this.hovering, this.format))
    }
  }

  private makeBlock = (resize: boolean) => {
    const { x, y, w, h, cols, hasSort } = this

    let thisX = x
    let thisY = y
    let thisW = w
    let thisH = h

    const setRect = (index: number) => {
      const xPos = index % cols
      const yPos = Math.floor(index / cols)
      thisX = thisW * xPos
      thisY = thisH * yPos
    }
    if (!resize) {
      this.dataIds.forEach((id, index) => {
        setRect(index)
        if (hasSort) {
          this.blocks[id] = new Block(this, this.jsonDatas[id], thisX, thisY, thisW, thisH)
        } else {
          let block = this.blocks[id]
          if (!block) {
            block = this.blocks[id] = new Block(this, this.jsonDatas[id], thisX, thisY, thisW, thisH)
          } else {
            //데이터만 업데이트
            const data = this.jsonDatas[id]
            block.updateData(data)
          }
        }
      })
    } else {
      // 사이즈 조정에 의해 새로 그림
      this.dataIds.forEach((id, index) => {
        setRect(index)
        this.blocks[id].resizeBlock(thisX, thisY, thisW, thisH)
      })
    }
  }

  private cols = 0
  private rows = 0
  private w = 0
  private h = 0

  private setBlockBase = (resize = false) => {
    const count = this.dataIds.length
    const prevCount = this.prevDataIds.length
    const arrChange = count !== prevCount

    if (arrChange || resize) {
      // 화면 비율에 따라 행렬 수를 결정함
      const ratio = this.width / this.height
      this.cols = Math.floor(Math.sqrt(ratio * count))
      this.rows = Math.ceil(count / this.cols)
      this.w = this.width / this.cols
      this.h = this.height / this.rows
    }
    this.makeBlock(resize)
  }

  private setAttribute = (resize = false) => {
    this.setBlockBase(resize)
  }

  public getStatusColor = (status: Status = undefined, alpha: number = 1) => {
    const { themeAttrs, colorMeta } = this
    let color = colorMeta?.normal || themeAttrs.normal_1
    switch (status) {
      case 'inactive':
        color = colorMeta?.inactive || themeAttrs.disabled_color
        break
      case 'error':
        color = colorMeta?.error || themeAttrs.bg_critical_color
        break
      case 'warning':
        color = colorMeta?.warning || themeAttrs.bg_warning_color
        break
      default:
    }
    return alpha < 1 ? hex2rgba(color, alpha) : color
  }

  /**
   * Events
   */
  public resizeEvent = () => {
    this.width = this.canvas.clientWidth
    this.height = this.canvas.clientHeight

    this.x = 0
    this.y = 0
    this.ctx = setCanvasDPI(this.canvas)
    this.ctx.fillStyle = '#bdbdbd'
    this.setAttribute(true)
    this.draw()
  }

  private mouseClickEvent = (e: MouseEvent) => {
    if (typeof this.onClick === 'function') {
      const len = this.dataIds.length
      for (let i = 0; i < len; i++) {
        const block = this.blocks[this.dataIds[i]]
        if (inMouseOnRect(block.pos, e)) {
          this.onClick(block.data.value, block.data)
          break
        }
      }
    }
  }

  private mouseHoverThrottlingTimmer: any
  private mouseHoverDebounceEvent?: MouseEvent
  private mouseHoverEvent = (e: MouseEvent) => {
    if (!this.mouseHoverThrottlingTimmer) {
      this.mouseHoverDebounceEvent = e
      this.mouseHoverThrottlingTimmer = setTimeout(() => {
        if (this.mouseHoverDebounceEvent) {
          this.mouseHoverEventFunc(this.mouseHoverDebounceEvent)
          if (this.mouseHoverCallback) {
            this.mouseHoverCallback(this.hovering)
          }
        }
        this.mouseHoverThrottlingTimmer = null
      }, 60)
    } else {
      this.mouseHoverDebounceEvent = e
    }
  }

  private mouseHoverEventFunc = (e: MouseEvent) => {
    let nexthovering
    const tooltip = this.tooltip
    this.dataIds.some((id) => {
      const block = this.blocks[id]

      if (inMouseOnRect(block.pos, e)) {
        nexthovering = block
        return true
      }
    })

    if (this.hovering !== nexthovering) {
      if (nexthovering) {
        this.tooltip.changeText(getTooltip(nexthovering, this.format))
        this.tooltip.follow(e)
        if (!tooltip.tooltipStat) this.tooltip.tooltipOn()
      } else if (tooltip.tooltipStat) {
        tooltip.tooltipOff()
      }

      this.hovering = nexthovering
      requestAnimationFrame(this.draw)
    } else if (this.hovering) {
      tooltip.follow(e)
    }
  }

  private mouseLeaveEvent = () => {
    if (this.mouseHoverThrottlingTimmer) {
      clearTimeout(this.mouseHoverThrottlingTimmer)
      this.mouseHoverThrottlingTimmer = null
    }
    if (this.hovering) {
      this.hovering = undefined
      this.draw()
    }
    if (this.mouseHoverCallback) {
      this.mouseHoverCallback(undefined)
    }
    if (this.tooltip.tooltipStat) {
      this.tooltip.tooltipOff()
    }
  }
}

export default BlockChart
