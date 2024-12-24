import request from '@/utils/request'

// 获取列表
export const getCurrentMenuList = (params: API_BASE.GetEatMenuClassifyListParams) => {
  return request<{ data: API_BASE.GetEatMenuListData[] }>(
    '/api/user/eat_what',
    {
      method: 'GET',
      params
    })
}

// 新增菜单
export const postCurrentMenu = (data: API_BASE.PostEatMenuData) => {
  return request(
    '/api/user/eat_what',
    {
      method: 'POST',
      data
    })
}

// 修改菜单
export const putCurrentMenu = (data: API_BASE.PutEatMenuData) => {
  return request(
    '/api/user/eat_what',
    {
      method: 'PUT',
      data
    })
}

// 删除菜单
export const deleteCurrentMenu = (params: { _id: string }) => {
  return request(
    '/api/user/eat_what',
    {
      method: 'DELETE',
      params
    })
}

// 菜单详情
export const getCurrentMenuDetail = (params: { _id: string }) => {
  return request<{ data: API_BASE.GetEatMenuListData }>(
    '/api/user/eat_what/detail',
    {
      method: 'GET',
      params
    })
}

// 分类列表
export const getCurrentMenuClassifyList = (params: API_BASE.GetEatMenuClassifyListParams) => {
  return request<{ data: API_BASE.GetEatMenuClassifyListData[]; total: number }>('/api/user/eat_what/classify', {
    method: 'GET',
    params,
  });
};