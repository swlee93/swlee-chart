interface Layout {
  width: number
  height: number
  top: number
  left: number
}
interface GroupedLayout {
  [groupValue: string]: Layout
}
class GroupLayout {
  public width: number = 0
  public height: number = 0
  public groupedLayout: GroupedLayout = {}
  public Chart: any
  private canvas: HTMLDivElement
  public Charts: any[] | undefined
  constructor(canvas: HTMLDivElement, Chart: any) {
    this.canvas = canvas
    const { width, height } = canvas.getBoundingClientRect() || {}
    this.width = width
    this.height = height
    this.Chart = Chart
    this.resizeEvent()
  }
  public getGrouped = (data: any[], groupKey: string = 'group') => {
    let totalCount = 0

    const groupedCount: { [groupValue: string]: number } = data?.reduce((acc, curr) => {
      const groupValue = curr[groupKey]
      if (groupValue) {
        if (!acc[groupValue]) {
          acc[groupValue] = 0
        }
        acc[groupValue] += 1
        totalCount += 1
      }
      return acc
    }, {})

    let left: Layout = { top: 0, left: 0, width: this.width, height: this.height }
    this.groupedLayout = Object.entries(groupedCount)
      .sort(([_a, a], [_b, b]) => a - b)
      .reduce<[string, number][]>((acc, curr) => {
        acc.push(curr)
        return acc
      }, [])
      .reduce<GroupedLayout>((acc, [groupValue, groupCount], index) => {
        const isVerticalRect = index % 2 === 0
        const ratio = groupCount / totalCount
        const containerWidth = left.width
        const containerHeight = left.height
        const width = isVerticalRect ? containerWidth * ratio : containerWidth
        const height = isVerticalRect ? containerHeight : containerHeight * ratio
        const x = isVerticalRect ? left.top : this.width - containerWidth
        const y = (index - 1) % 2 > 0 ? this.height - containerHeight : left.left
        console.log((index - 1) % 2 > 0, left.left, height, y)
        acc[groupValue] = {
          width,
          height,
          top: x,
          left: y,
        }

        left = {
          width: isVerticalRect ? containerWidth - width : containerWidth,
          height: isVerticalRect ? containerHeight : containerHeight - height,
          top: isVerticalRect ? x : this.width - x,
          left: isVerticalRect ? y : this.height - y,
        }
        totalCount = totalCount - groupCount
        return acc
      }, {})
  }

  public draw = (data: any[] = [], groupBy: string = 'group') => {
    this.Charts = Object.entries(this.groupedLayout).map(([groupValue, groupLayout]) => {
      let canvas = document.createElement('canvas')
      const { top, left, width, height } = groupLayout
      canvas.width = width
      canvas.height = height
      canvas.style.top = top + 'px'
      canvas.style.left = left + 'px'
      canvas.style.position = 'absolute'
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      this.canvas.appendChild(canvas)
      const Chart = new this.Chart(canvas)
      Chart.loadData(data.filter((a) => String(a[groupBy]) === groupValue))
    //   Chart.resizeEvent()
      return Chart
    })
  }
  public loadData = (data: any[], groupBy: string = 'group') => {
    this.getGrouped(data, groupBy)
    this.draw(data, groupBy)
  }

  public resizeEvent = () => {
    this.width = this.canvas.clientWidth
    this.height = this.canvas.clientHeight
  }
}

export default GroupLayout
