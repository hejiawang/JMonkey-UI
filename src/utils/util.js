import Vue from 'vue'

/**
 * 生成随机len位数字
 */
export const randomLenNum = (len, date) => {
  let random = ''
  random = Math.ceil(Math.random() * 100000000000000).toString().substr(0, typeof len === 'number' ? len : 4)
  if (date) random = random + Date.now()
  return random
}

/**
 * 将树形结构转换为array
 * @param data 树形结构对象
 * @param expandAll 是否展开
 * @param parent 父结构对象
 * @param level 等级
 */
export const treeToArray = ( data, expandAll, parent = null, level = null ) => {
  let treeArray = [];
  Array.from(data).forEach(function(record) {

    if (record.treeExpanded === undefined) Vue.set(record, '_expanded', expandAll); //设置节点是否展开

    let _level = 1;
    if (level !== undefined && level !== null)  _level = level + 1;
    Vue.set(record, '_level', _level); //设置节点层级

    if (parent) Vue.set(record, 'parent', parent);  //如果有父元素

    treeArray.push(record);

    if (record.children && record.children.length > 0) {  //递归子节点
      const children = treeToArray(record.children, expandAll, record, _level);
      treeArray = treeArray.concat(children)
    }
  });

  return treeArray;
}
