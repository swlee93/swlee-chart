export const uid = (prefix: string | number = 'root') => {
  return `${prefix}_${Math.random().toString(16).split('.')[1]}`
}

export const DEFAULT_DATUM = {
  name: 'default',
  value: 0,
  group: 'none',
}

const getRandomNumber = (y = 2) => Math.ceil(Math.random() * Math.pow(10, y))
const getRandomColor = (length = 10) =>
  Array(length)
    .fill(() => '#' + Math.floor(Math.random() * 16777215).toString(16))
    .map((t) => t())
const GROUPS = getRandomColor(2)
const GROUPS1 = getRandomColor(3)

export const getClusterMockData = () =>
  Array(getRandomNumber(2))
    .fill((random: number) => ({
      value: random,
      name: random,
      group: GROUPS[random % GROUPS.length],
      group1: GROUPS1[random % GROUPS1.length],
    }))
    .map((trig) => trig(getRandomNumber(2)))

export const flattenClusterData = (bucket: any[], clusterDatasource: any) => {
  Object.values(clusterDatasource).forEach((data: any) => {
    const { cluster, datasource } = data

    let children: any = []
    if (cluster.isLeaf) {
      children = datasource
    } else {
      flattenClusterData(children, cluster.cluster)
    }
    bucket.push({ ...cluster.datum, children })
  })
}
