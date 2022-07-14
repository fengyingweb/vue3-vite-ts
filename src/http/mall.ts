import request from './request'
import {User} from '../interface/index'

// 注册
export function register(params: User) {
  return request({
    url: '/api/user/register',
    method: 'post',
    data: params
  })
}

// 登录
export function login(params: User) {
  return request({
    url: '/api/user/login',
    method: 'post',
    data: params
  })
}

// 获取首页商品信息
export function queryAllGoodsIndex() {
  return request({
    url: '/api/goods/index',
    method: 'get',
    params: {}
  })
}