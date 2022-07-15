import { defineStore } from 'pinia';
import { queryCategoryList, queryCategorySubList, queryGoodsListByCategorySubID} from '../http/mall';
import { CategorySubParams, CategorySubLimitParams, } from '../interface/index';

export const categoryStore = defineStore('category', {
  state: ()=> {
    return {
      category: [], // 大类别
      categorySub: [], // 小类别
      goodList: [], // 商品列表
    }
  },
  getters: {
    categoryGetters: (state)=> state.category,
    categorySubGetters: (state)=> state.categorySub,
    goodListGetters: (state)=> state.goodList,
  },
  actions: {
    // 获取商品大类列表
    async getCategoryData() {
      try {
        const res = await queryCategoryList();
        return res;
      } catch (err) {
        console.log(err);
      }
    },

    // 获取商品小类数据
    async getCategorySubData(params:CategorySubParams) {
      try {
        const res = await queryCategorySubList(params);
        return res;
      } catch (err) {
        console.log(err);
      }
    },

    // 根据商品类别获取商品列表,分页查询
    async getLimitByCategorySubID(params:CategorySubLimitParams) {
      try {
        const res = await queryGoodsListByCategorySubID(params);
        return res;
      } catch (err) {
        console.log(err)
      }
    }
  } 
})