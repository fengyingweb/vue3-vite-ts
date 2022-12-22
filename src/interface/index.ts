export interface User {
  userName: string;
  password: string;
}

export interface ResData {
  code: number;
  data: any;
  msg: string;
}

export interface FloorData {
  goodsId: string;
  image: string;
}

export interface CategorySubParams {
  categoryId: string;
}

export interface CategorySubLimitParams {
  categorySubId: string;
  pageNo: number;
  pageSize?: number;
}

export interface DetailParams {
  goodsId: string;
}

export interface AddShopCarParams {
  goodsId: string;
  name: string;
  price: number;
  image: string;
  goodsNums: number;
  userId: string;
}

export interface QueryShopCarParams {
  id: string|number
}

export interface UpdateShopCarParams {
  goodsId: string;
  userId: string;
  goodsNums: number;
}

export interface DeleteCarParams {
  shopCarIdList: string[]
}

export interface GoodsDetail {
  ID: string;
  NAME: string;
  PRESENT_PRICE: number;
  IMAGE1: string;
  [key: string]: any
}