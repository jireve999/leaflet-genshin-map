import axios,{ type AxiosInstance } from 'axios';
import { MainHost } from './constants';
export class BaseRequest {
  private axiosInst: AxiosInstance;

  constructor(host: string) {
    this.axiosInst = axios.create({
      baseURL: host,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 15000
    })
  }

  sendReuest(method: string, path: string, params: any = null, data: any=null) {
    // return this.axiosInst.request({
    //   method,
    //   url: path,
    //   params,
    //   data
    // })
    return new Promise((resolve, reject) => { 
      this.axiosInst.request({
        method,
        url: path,
        params,
        data
      }).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  }
}

export const mainRequest = new BaseRequest(MainHost);