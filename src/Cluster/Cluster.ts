import { uid, DEFAULT_DATUM } from './ClusterMeta'

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

interface managedClusterDatum {
  parentId?: string
  children?: Cluster[]
}

interface StaticDatum extends managedClusterDatum {
  value: string | number
  name: string | number
}

type ClusterDatum = StaticDatum & DynamicGroup
type ClusterData = ClusterDatum[]

type ClusterManagedDatasource = {
  [groupValue: string]: { cluster: Cluster; datasource: ClusterData }
}

interface ClusterProps {
  depth: number
  parentId?: string
}
class Cluster {
  private parentId: string | undefined
  private id: string | undefined
  private depth: number = 0
  public isLeaf: boolean = false
  public datum: ClusterDatum | null = null
  public cluster: ClusterManagedDatasource = {}

  constructor(props: ClusterProps = { depth: 0, parentId: 'root' }) {
    const { depth = 0, parentId } = props
    this.id = uid(depth)
    this.parentId = parentId
    this.depth = depth
  }

  public draw = () => {}
  public calculate = () => {}
  public setData = (datasource: ClusterData = []) => {
    let datumGroupValueKey: keyof Partial<ClusterDatum> = `group${this.depth || ''}`

    const managedDatasource = datasource.reduce<ClusterManagedDatasource>((acc, datum = DEFAULT_DATUM) => {
      const groupValue = datum[datumGroupValueKey]

      // break
      if (!groupValue) {
        this.datum = datum
        this.isLeaf = true
        return acc
      }

      // push
      if (!acc[groupValue]) {
        acc[groupValue] = {
          cluster: new Cluster({ depth: this.depth + 1, parentId: this.id }),
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
  }

  public print = () => {
    console.log(this)
  }
}

const c = new Cluster()
c.setData(MOCK_DATA)
c.print()

export default Cluster
