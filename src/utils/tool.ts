
// 处理query 传参的时候导致的空字符串查询问题（后端不愿意给处理）
export const formatQuery = (query: any ={})=>{
  const ret = {}
  Object.keys(query).forEach((key) => {
    if( query[key] !== null && query[key] !== undefined && query[key]!=='' ){
      ret[key] = query[key]
    }
  })
  return ret;
}