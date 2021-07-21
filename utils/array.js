const parseToTree = (data, parentKey = 'pId', childKey = 'children') => {
  const result = []
  data.forEach((item, index) => {
    if (!item.pId || !data.some(other => other.menuId === item.pId)) {
      // 根节点
      result.push(JSON.parse(JSON.stringify(item)))
      // 空指针
      item = null
    }
  })
  const loop = (arr) => {
    if (!arr.length) return
    const nextNodes = []
    arr.forEach(root => {
      root.children = []
      data.forEach((item, index) => {
        if (item && item.pId === root.menuId) {
          root.children.push(item)
          nextNodes.push(item)
          data.splice(index, 1)
        }
      })
    })
    loop(nextNodes)
  }
  loop(result)
  return result
}

module.exports = {
  parseToTree
}