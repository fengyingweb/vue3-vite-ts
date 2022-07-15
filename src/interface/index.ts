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