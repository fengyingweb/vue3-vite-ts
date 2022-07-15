import request from './request'
import {User, CategorySubParams, CategorySubLimitParams, DetailParams} from '../interface/index'

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

// 获取商品大类列表
export function queryCategoryList() {
  return request({
    url: '/api/goods/getCategoryList',
    method: 'get',
    params: {}
  })
}

// 获取商品小类数据
export function queryCategorySubList(params:CategorySubParams) {
  return request({
    url: '/api/goods/getCategorySubList',
    method: 'post',
    data: params
  })
}

// 根据商品类别获取商品列表,分页查询
export function queryGoodsListByCategorySubID(params:CategorySubLimitParams) {
  return request({
    url: '/api/goods/getGoodsListByCategorySubID',
    method: 'post',
    data: params
  })
}

// 获取商品详情信息
export function queryDetailGoodsInfo(params: DetailParams) {
  return request({
    url: '/api/goods/getDetailGoodsInfo',
    method: 'post',
    data: params
  })
}