import { uid, DEFAULT_DATUM, flattenClusterData } from './ClusterMeta'
import Treemap from '../Treemap'

interface DynamicGroup {
  [groupNumber: string]: number | string
}
interface StaticDatum {
  value: number
  name: string | number
}

interface TreemapDatum {
  x0?: number
  x1?: number
  y0?: number
  y1?: number
}

type ClusterDatum = StaticDatum & DynamicGroup & TreemapDatum
type ClusterData = ClusterDatum[]

type ClusterManagedDatasource = {
  [groupValue: string]: { cluster: Cluster; datasource: ClusterData }
}
interface DrawOption {}
interface CalculateOption {
  depth?: number
}
interface ClusterProps {
  depth?: number
  parentId?: string | null
  group?: string | number
  index?: number
}

class Cluster {
  private parentId: string | null
  private id: string | null
  private depth: number = 0
  private index: number = 0
  private group: string | number = 'root'

  public isLeaf: boolean = false
  public datum: ClusterDatum | null = null
  public cluster: ClusterManagedDatasource = {}
  public values: (number | number[])[] = []
  public node: ClusterData = []
  constructor(props: ClusterProps = {}) {
    const { depth = 0, parentId = null, group = 'root', index = 0 } = props
    this.id = uid(depth)
    this.parentId = parentId
    this.depth = depth
    this.group = group
    this.index = index
  }

  public setData = (datasource: ClusterData = []) => {
    let thisDatum: ClusterDatum = { name: this.group, value: 0 }
    let datumGroupValueKey: keyof Partial<ClusterDatum> = `group${this.depth || ''}`

    const managedDatasource = datasource.reduce<ClusterManagedDatasource>((acc, datum = DEFAULT_DATUM, index) => {
      // acc this.datum
      thisDatum.value += datum.value

      // group value
      const groupValue = datum[datumGroupValueKey]

      // break
      if (!groupValue) {
        this.isLeaf = true
        return acc
      }

      // push
      if (!acc[groupValue]) {
        acc[groupValue] = {
          // new child cluster
          cluster: new Cluster({ depth: this.depth + 1, parentId: this.id, group: groupValue, index }),
          datasource: [],
        }
      }
      acc[groupValue].datasource.push(datum)
      return acc
    }, {})

    Object.values(managedDatasource).forEach((groupData) => {
      groupData.cluster.setData(groupData.datasource)
    })
    this.cluster = managedDatasource
    this.datum = thisDatum
  }

  public calculate = (rect: { x: number; y: number; w: number; h: number }, calculateOption: CalculateOption = {}) => {
    const { x = 0, y = 0, w, h } = rect
    let bucket: any[] = []
    flattenClusterData(bucket, this.cluster)
    this.node = Treemap(bucket, { x0: x, y0: y, x1: x + w, y1: y + h }, calculateOption)
    console.log('bucket', bucket, calculateOption)
    console.log('this.node', this.node)
    this.print()
  }
  public draw = (render: (datum: ClusterDatum) => any, drawOption: DrawOption = {}) => {
    return this.node.map((datum) => {
      return render(datum)
    })
  }

  public print = () => {
    console.log(this)
  }
}

export default Cluster
