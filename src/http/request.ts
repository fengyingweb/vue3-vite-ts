import { Notify, Toast } from 'vant'
import axios from 'axios'

axios.defaults.timeout = 90000 // 请求超时时间
// axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:3001';

export const DEBOUNCE_ERR = '请勿重复操作'
interface AxiosConfig {
  [propName:string]: any;
}
// request拦截器
axios.interceptors.request.use(
    (config: AxiosConfig) => {
        return config
    },
    error => {
        if (error.message !== DEBOUNCE_ERR) {
            Toast.clear()
        }
        Promise.reject(error)
    }
)

// respone拦截器
axios.interceptors.response.use(
    (response:AxiosConfig) => {
        // Toast.clear()

        if (response.data && response.data.code === 403) {
            if (response.config.hasNotify) {
                Notify(response.data.msg)
            }
            return response.data
        } else if (response.data && response.data.code && response.data.code !== '0' && response.data.code !== 200) {
            if (response.config.hasNotify) {
                Notify(response.data.msg)
            }
            return response.data
        } else {
            return response.data
        }
    },
    error => {
        if (error.message !== DEBOUNCE_ERR) {
            Toast.clear()
        }

        const response = Object.assign({}, error.response)
        if (response) {
            switch (response.status) {
                case 401:
                    if (error.config.hasNotify) {
                        Notify('你还没有登录呦！')
                    }
                    break
                case 404:
                    if (error.config.hasNotify) {
                        Notify('没找接口信息')
                    }
                    break
                case 500:
                    if (error.config.hasDefaultNotify) {
                        Notify('系统异常')
                    }
                    break
                default:
                    if (error.config && error.config.hasNotify) {
                        Notify(error.message)
                    }
                    break
            }
        }
        return Promise.reject(error)
    }
)

export default axios
