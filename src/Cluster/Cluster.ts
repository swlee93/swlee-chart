import { uid, DEFAULT_DATUM } from './ClusterMeta'
import Treemap from './Treemap'

const getRandomNumber = (y = 2) => Math.floor(Math.random() * Math.pow(10, y))
const getRandomGroup = (prefix = 'group', y = 2) => prefix + Math.floor(Math.random() * Math.pow(10, y)).toString()
const GROUPS = getRandomGroup('A', 2)
const GROUPS1 = getRandomGroup('a', 3)

const MOCK_DATA = Array(getRandomNumber())
  .fill((random: number) => ({
    value: random,
    name: `${random} in ${GROUPS[random % GROUPS.length]}_${GROUPS1[random % GROUPS1.length]}`,
    group: GROUPS[random % GROUPS.length],
    group1: GROUPS1[random % GROUPS1.length],
  }))
  .map((trig) => trig(getRandomNumber()))
console.log('MOCK_DATA', MOCK_DATA)

interface DynamicGroup {
  [groupNumber: string]: number | string
}
interface StaticDatum {
  value: number
  name: string | number
}

type ClusterDatum = StaticDatum & DynamicGroup
type ClusterData = ClusterDatum[]

type ClusterManagedDatasource = {
  [groupValue: string]: { cluster: Cluster; datasource: ClusterData }
}

interface ClusterProps {
  depth?: number
  parentId?: string | null
  group?: string | number
  index?: number
}
type Rect = [x: number, y: number, w: number, h: number]
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
  public node: (Rect | Rect[])[] = []
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

  public flattenClusterData = (data: any[]) => {
    Object.entries(this.cluster).forEach(([groupValue, groupData]) => {
      if (groupData.cluster.isLeaf) {
        data.push(groupData.datasource.map((datum) => datum))
      } else {
        let childData: Array<number | number[]> = []
        groupData.cluster.flattenClusterData(childData)
        data.push(childData)
      }
    })
    return data
  }

  public calculate = ({ x = 0, y = 0, w, h }: { x: number; y: number; w: number; h: number }) => {
    let flattenData: any[] = []
    this.flattenClusterData(flattenData)
    this.node = Treemap.generate(flattenData, w, h, x, y)
    console.log('flattenData', flattenData)
    console.log('this.node', this.node)
  }
  public draw = (render: (rect: any, datum: ClusterDatum) => any) => {
    const callbackRender = (node: Rect | Rect[]) => {
      if (Array.isArray(node)) {
        if (typeof node[0] === 'number') {
          render(node, { name: 'test', value: 0 })
        } else {
          node.forEach((child: any) => callbackRender(child))
        }
      }
    }
    this.node.forEach((rect) => {
      callbackRender(rect)
    })
  }

  public print = () => {
    console.log(this)
  }
}

const c = new Cluster()
c.setData(MOCK_DATA)
c.calculate({ x: 0, y: 0, w: 100, h: 100 })
c.draw(([x, y, w, h], datum) => {
  console.log('render', [x, y, w, h], datum)
})
// c.print()
export default Cluster
