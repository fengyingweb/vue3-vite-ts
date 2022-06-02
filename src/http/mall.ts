import request from './request'
import {User} from '../interface/index'

export function register(params: User) {
  return request({
    url: '/api/user/register',
    method: 'post',
    data: params
  })
}