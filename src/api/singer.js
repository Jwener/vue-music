import jsonp from '../common/js/jsonp'
import axios from 'axios'
import {
  commonParams,
  options
} from './config'

export function getSingerList() {
  const url = '/api/getSingerList'
  const data = {
    callback: 'getUCGI05940760745963947',
    g_tk: 5381,
    jsonpCallback: 'getUCGI05940760745963947',
    loginUin: 0,
    hostUin: 0,
    format: 'jsonp',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq',
    needNewCode: 0,
    data: {
      'comm': {
        'ct': 24,
        'cv': 10000
      },
      'singerList': {
        'module': 'Music.SingerListServer',
        'method': 'get_singer_list',
        'param': {
          'area': -100,
          'sex': -100,
          'genre': -100,
          'index': -100,
          'sin': 0,
          'cur_page': 1
        }
      }
    }
  }
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
export function getSingerDetail(singermid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
  const data = Object.assign({}, commonParams, {
    hostuin: 0,
    needNewCode: 0,
    platform: 'yqq',
    order: 'listen',
    begin: 0,
    num: 100,
    singermid: singermid,
    songstatus: 1,
    g_tk: 5381
  })
  return jsonp(url, data, options)
}

export function getSongUrl(songmid) {
  const url = '/api/getSongUrl'
  const data = {
    callback: 'getplaysongvkey5071978159393402',
    g_tk: 5381,
    jsonpCallback: 'getplaysongvkey5071978159393402',
    loginUin: 0,
    hostUin: 0,
    format: 'jsonp',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq',
    needNewCode: 0,
    data: {
      'req': {
        'module': 'CDN.SrfCdnDispatchServer',
        'method': 'GetCdnDispatch',
        'param': {
          'guid': '3147422392',
          'calltype': 0,
          'userip': ''
        }
      },
      'req_0': {
        'module': 'vkey.GetVkeyServer',
        'method': 'CgiGetVkey',
        'param': {
          'guid': '3147422392',
          'songmid': [songmid],
          'songtype': [0],
          'uin': '0',
          'loginflag': 1,
          'platform': '20'
        }
      },
      'comm': {
        'uin': 0,
        'format': 'json',
        'ct': 20,
        'cv': 0
      }
    }
  }
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
