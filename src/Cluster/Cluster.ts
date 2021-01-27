import { uid, flattenClusterData, getDefaultDatum } from './ClusterMeta'
import Treemap from '../Treemap'

interface Value {
  [key: string]: number | string
}
interface Layout {
  x0?: number
  x1?: number
  y0?: number
  y1?: number
}

type ClusterDatum = Value & Layout
type ClusterData = ClusterDatum[]

type ClusterManagedDatasource = {
  [groupValue: string]: { cluster: Cluster; datasource: ClusterData }
}

interface CalculateOption {
  depth?: number
}
interface DrawOption {}

type DataKey = {
  nameKey: string
  valueKey: string
  groupKey: string
  group1Key: string
  group2Key: string
}

interface TreemapProps {
  depth: number
  parentId: string | null
  group: string | number
  index: number
}

type ClusterProps = Partial<TreemapProps> & Partial<DataKey>
class Cluster {
  private parentId: string | null
  private id: string | null
  private depth: number = 0
  private index: number = 0
  private group: string | number = 'root'
  private nameKey: string = 'name'
  private valueKey: string = 'value'
  private groupKey: string = 'group'
  private group1Key: string = 'group1'
  private group2Key: string = 'group2'

  public isLeaf: boolean = true
  public datum: ClusterDatum | null = null
  public cluster: ClusterManagedDatasource = {}
  public nodes: ClusterData = []

  constructor(props?: ClusterProps) {
    const {
      depth = 0,
      parentId = null,
      group = 'root',
      index = 0,
      nameKey = 'name',
      valueKey = 'value',
      groupKey = 'group',
      group1Key = 'group1',
      group2Key = 'group2',
    } = props || {}

    this.id = uid(depth)
    this.parentId = parentId
    this.depth = depth
    this.group = group
    this.index = index
    this.nameKey = nameKey
    this.valueKey = valueKey
    this.groupKey = groupKey
    this.group1Key = group1Key
    this.group2Key = group2Key
  }

  private getDataKey = (): DataKey & { [key: string]: string } => {
    return {
      nameKey: this.nameKey,
      valueKey: this.valueKey,
      groupKey: this.groupKey,
      group1Key: this.group1Key,
      group2Key: this.group2Key,
    }
  }

  public setData = (datasource: ClusterData = []) => {
    const dataKey = this.getDataKey()
    const groupDepth = `group${this.depth || ''}`
    const groupDataKey = `${groupDepth}Key`
    const datumGroupValueKey = dataKey[groupDataKey] || groupDepth

    let thisDatum: ClusterDatum = {
      [dataKey.nameKey]: this.group,
      [dataKey.valueKey]: 0,
    }

    const managedDatasource = datasource.reduce<ClusterManagedDatasource>(
      (acc, datum = getDefaultDatum(dataKey), index) => {
        // acc this.datum
        thisDatum[dataKey.valueKey] =
          (Number(datum[dataKey.valueKey]) || 0) + (Number(thisDatum[dataKey.valueKey]) || 0)

        // group value
        const groupValue = datum[datumGroupValueKey]
        // break
        if (!groupValue) {
          this.isLeaf = true
          return acc
        } else {
          this.isLeaf = false
        }

        // push
        if (!acc[groupValue]) {
          acc[groupValue] = {
            // new child cluster
            cluster: new Cluster({ depth: this.depth + 1, parentId: this.id, group: groupValue, index, ...dataKey }),
            datasource: [],
          }
        }
        acc[groupValue].datasource.push(datum)
        return acc
      },
      {},
    )
    const managedDatasourceValues = Object.values(managedDatasource)
    if (managedDatasourceValues?.length) {
      managedDatasourceValues.forEach((groupData) => {
        groupData.cluster.setData(groupData.datasource)
      })
      this.cluster = managedDatasource
    } else {
      // 클러스터링할 그룹이 없는경우 자기 자신을 참조함
      this.cluster = {
        [this.group]: {
          cluster: this,
          datasource: datasource?.filter((datum) => !!datum[dataKey.valueKey]),
        },
      }
    }

    this.datum = thisDatum
  }

  public calculate = (rect: { x: number; y: number; w: number; h: number }, calculateOption: CalculateOption = {}) => {
    const { x = 0, y = 0, w, h } = rect
    let bucket: any[] = []
    flattenClusterData(bucket, this.cluster)
    console.log('bucket', this.cluster, bucket)
    this.nodes = Treemap(bucket, { x0: x, y0: y, x1: x + w, y1: y + h }, { ...calculateOption, ...this.getDataKey() })
    this.print()
  }

  public draw = (render: (datum: ClusterDatum) => any, drawOption: DrawOption = {}) => {
    return this.nodes.map((datum) => {
      return render(datum)
    })
  }

  public print = () => {
    console.log(this)
  }
}

export default Cluster
