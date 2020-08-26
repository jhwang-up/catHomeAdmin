import request from '@/utils/request'

export function addCatStore(data) {
  return request({
    url: '/api/v1/catstore/add',
    method: 'post',
    data
  })
}
