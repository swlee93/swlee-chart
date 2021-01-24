export const uid = (prefix: string | number = 'root') => {
  return `${prefix}_${Math.random().toString(16).split('.')[1]}`
}

export const getDefaultDatum = (option: any) => {
  return {
    [option?.nameKey || 'name']: 'default',
    [option?.valueKey || 'value']: 0,
    [option?.groupKey || 'group']: 'none',
  }
}

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
