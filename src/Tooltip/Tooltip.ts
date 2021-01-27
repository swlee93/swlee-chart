import { setCanvasDPI, inMouseOnRect, hex2rgba } from '../chartUtils'
import TooltipElement, * as TD from '../chartTooltip'

class Tooltip {
  public target: HTMLElement | HTMLCanvasElement | null = null
  public hovering: any
  public tooltip: any

  public getTooltip: (datum: any) => HTMLElement | null = (datum) => null
  private nodes: any[] = []
  private tootipTemplateNode: HTMLElement = document.createElement('div')
  constructor(renderer: (datum: any) => string) {
    this.tooltip = new TooltipElement()
    this.getTooltip = (datum: any) => {
      this.tootipTemplateNode.innerHTML = renderer(datum)
      return this.tootipTemplateNode
    }
  }

  public setTarget = (target: HTMLElement | HTMLCanvasElement | null) => {
    if (target && !this.target) {
      this.target = target
      this.target.addEventListener('mousemove', this.mouseHoverEvent)
      this.target.addEventListener('mouseleave', this.mouseLeaveEvent)
    }
  }

  public setNodes = (nodes: any[]) => {
    this.nodes = nodes
  }

  private mouseHoverThrottlingTimmer: any
  private mouseHoverDebounceEvent?: Event

  private mouseHoverEvent = (e: Event) => {
    if (!this.mouseHoverThrottlingTimmer) {
      this.mouseHoverDebounceEvent = e
      this.mouseHoverThrottlingTimmer = setTimeout(() => {
        if (this.mouseHoverDebounceEvent) {
          this.mouseHoverEventFunc(this.mouseHoverDebounceEvent)
        }
        this.mouseHoverThrottlingTimmer = null
      }, 60)
    } else {
      this.mouseHoverDebounceEvent = e
    }
  }
  public getNodeId = (node: any = {}) => {
    const { x0 = 0, x1 = 0, y0 = 0, y1 = 0 } = node
    return `${x0}:${x1}:${y0}:${y1}`
  }
  private mouseHoverEventFunc = (e: Event) => {
    const tooltip = this.tooltip
    console.log('this.nodes', this.nodes)
    let nexthovering: any = this.nodes.find((node = {}) => {
      const { x0, x1, y0, y1 } = node
      if (
        typeof x0 !== 'undefined' &&
        typeof x1 !== 'undefined' &&
        typeof y0 !== 'undefined' &&
        typeof y1 !== 'undefined'
      ) {
        const rect: [number, number, number, number] = [x0, y0, x1 - x0, y1 - y0]
        console.log('rect', rect)
        return inMouseOnRect(rect, e)
      } else {
        return false
      }
    })

    if (this.getNodeId(this.hovering) !== this.getNodeId(nexthovering)) {
      if (nexthovering) {
        this.tooltip.changeText(this.getTooltip(nexthovering))
        this.tooltip.follow(e)
        if (!tooltip.tooltipStat) this.tooltip.tooltipOn()
      } else if (tooltip.tooltipStat) {
        tooltip.tooltipOff()
      }

      this.hovering = nexthovering
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
    }

    if (this.tooltip.tooltipStat) {
      this.tooltip.tooltipOff()
    }
  }
}

export default Tooltip
