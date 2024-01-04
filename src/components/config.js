export default {
  // 讲树形数组转成数组
  flattening(tree) {
    let flatData = []
    let stack = [...tree]
    let parentIndex = {} // 存储level的索引
    while (stack.length) {
      let node = stack.shift()
      if (!node.level) {
        node.level = 0
        node.visible = true
        node._parentId = ''
        node._parentIds = ''
      }
      if (node.children) {
        parentIndex[node.level] = flatData.length // node的索引等于flatData的长度，因为接下来push的就是node
        const children = node.children.map(item => { // 设置子类的level
          return {
            ...item,
            level: node.level + 1,
            visible: node.expand,
            _parentId: node.id,
            _parentIds: node._parentIds ? node._parentIds + ',' + node.id : node.id
          }
        })
        stack.unshift(...children)
      }
      flatData.push({...node, children: []})
      if (node.level !== 0) { // 添加子类引用（只要level不是第一层，node肯定有父节点）
        flatData[parentIndex[node.level - 1]].children.push(flatData[flatData.length - 1]) // 往当前的node的父节点的children属性添加本身
      }
    }
    return flatData
  },

  flatteningChildren(children, node){
    return children.map(item=>{
      return {
        ...item,
        level: node.level+1,
        visible: false,
        isExpand: false,
        checked: node.checked,
        indeterminate: false,
        _parentId: node.id,
        _parentIds: node._parentIds ? node._parentIds + ',' + node.id : node.id
      }
    })
  },

  // 设置子级的展开状态
  setChildrenExpand(children, status){
    const travel = (list) => {
      list.forEach((child) => {
        child.visible = status
        if (child.children && child.children.length) {
          // 展开则只展开子集中的isExpand为true的
          // 收拢则全部收拢
          if ((status && child.isExpand) || !status)
            travel(child.children)
        }
      })
    }
    travel(children)
  },

  // 设置父级的展开状态
  setParentExpand(item, treeListData) {
    const parentIdArr = item._parentIds.split(",").reverse();
    parentIdArr.forEach((parentId) => {
      const parentItem = treeListData.find((i) => i.id === parentId);
      parentItem.isExpand = true;
      parentItem.children.forEach((i) => (i.visible = true));
    });
  },

  // 设置子级的选中状态
  setChildrenCheck(children, checked){
    const travel = (list) => {
      list.forEach((child) => {
        child.checked = checked
        child.indeterminate = false
        if (child.children && child.children.length) {
          travel(child.children)
        }
      })
    }
    travel(children)
  },

  // 设置父级的选中状态
  setParentCheck(item, checked, treeListData){
    const parentIdArr = item._parentIds.split(',').reverse()
    parentIdArr.forEach(parentId=>{
      const parentItem = treeListData.find(i=>i.id === parentId )
      if(checked){
        const everyChecked = parentItem.children.every(i=>i.checked)
        if(everyChecked){
          parentItem.checked = true
          parentItem.indeterminate = false
        }else {
          parentItem.checked = false
          parentItem.indeterminate = true
        }
      }else {
        const everyNotChecked = parentItem.children.every(i=>!i.checked && !i.indeterminate)
        if(everyNotChecked){
          parentItem.checked = false
          parentItem.indeterminate = false
        }else {
          parentItem.checked = false
          parentItem.indeterminate = true
        }
      }
    })
  },


}
