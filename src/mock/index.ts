import Mock from 'mockjs';

interface ResData {
  code: string;
  errMsg: null|string;
  msg: string;
  [propName:string]: any;
}
interface ConfigData {
  path:string;
  type:string;
  data:ResData;
}

const allDatas:ConfigData[] = [
  {
    path: '/hdAgvCallMaterial/selectWorkcenterUsers',
    type: 'post',
    data: {
      code: '0',
      errMsg: null,
      msg: "Success",
      data: {
        'list|5': [
          {
            'id|+1': 1,
            workcenterCode: function() {
              return 'AAAA-' + Math.floor(Math.random() * 10)
            },
            workcenterDesc: function() {
              return this.workcenterCode
            },
            workcenterName: function() {
              return this.workcenterCode
            }
          }
        ],
        offset: 5,
        pageNo: 1,
        pageSize: 5,
        totalCount: 11,
        totalPage: 3,
      }
    }
  }
];

const productDatas = (datas:ConfigData[]) => {
  datas.forEach((item: ConfigData) => {
    Mock.mock(new RegExp(item.path), item.type, item.data);
  });
};
console.log(Mock);
productDatas(allDatas);
