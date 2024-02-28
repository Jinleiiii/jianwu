import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import {View} from '@tarojs/components'
import isFunction from 'lodash/isFunction'
import { PreviewImage } from './previewImage';
import {AtImagePicker} from 'taro-ui'

const BaseUrl: string = 'http://localhost:3000';

export const UploadPic: React.FC<any> = ({
  maxNumber = 3, // 最大数量
  fileList = [], // 默认显示图片
  previewAble = true,
  interfaceName = '',
  fileChange,
}) => {
  const _accessoryFileList: any[] = [...fileList] // 后端用图片格式 arr

  const onChange = (files, doType, index) => {
    if (doType === 'add') {
      // add file
      const waitingUploadFiles = files.filter(f => !(f.url.includes('oss/')))
      uploadFile({ path: waitingUploadFiles });
    } else {
      // remove file
      _accessoryFileList.splice(index, 1)
      _fileChange(_accessoryFileList);
    }
  };

  const uploadFile = (data) => {
    let i = data.i ? data.i : 0 // 当前所上传的图片位置
    let success = data.success ? data.success : 0//上传成功的个数
    let fail = data.fail ? data.fail : 0;//上传失败的个数
    Taro.showLoading({
      title: `正在上传第${i + 1}张`
    })
    //发起上传
    Taro.uploadFile({
      url: `${BaseUrl}/${interfaceName}`,
      header: {
        'content-type': 'multipart/form-data',
        // 'token': data.token // 上传需要单独处理token
      },
      name: 'photos',
      filePath: data.path[i].url,
      success: (res) => {
        //图片上传成功，图片上传成功的变量+1
        console.log(res);
        
        if (res.statusCode !== 500) {
          success++;
          Taro.showToast({
            title: '上传成功',
            icon: 'success',
            duration: 2000
          })
          const responseData = JSON.parse(res.data)
          let imgAcc: any = null;
          if (responseData?.data?.downloadUrl) {
            const { downloadUrl } = responseData?.data
            imgAcc = {
              url: downloadUrl
            }
          }
          imgAcc && _accessoryFileList.push(imgAcc)
        } else {
          fail++;
          Taro.showToast({
            title: '上传失败，请稍后重试',
            icon: 'none',
            duration: 2000
          });
        }
      },
      fail: () => {
        fail++;//图片上传失败，图片上传失败的变量+1
        Taro.showToast({
          title: '上传失败，请稍后重试',
          icon: 'none',
          duration: 2000
        });
      },
      complete: () => {
        Taro.hideLoading()
        i++;//这个图片执行完上传后，开始上传下一张
        if (i == data.path.length) {   //当图片传完时，停止调用
          console.log('成功：' + success + " 失败：" + fail);
          _fileChange(_accessoryFileList);
          console.log('----------------_accessoryFileList', _accessoryFileList)
        } else {//若图片还没有传完，则继续调用函数
          data.i = i;
          data.success = success;
          data.fail = fail;
          uploadFile(data);
        }
      }
    })
  }

  const _fileChange = (_accessoryFileList) => {
    isFunction(fileChange) && fileChange(_accessoryFileList);
  };

  return (
    <View>
      <AtImagePicker
        multiple
        length={3}
        count={9}
        files={fileList}
        onImageClick={(i) => previewAble && PreviewImage(i, fileList)}
        onChange={onChange}
        showAddBtn={fileList.length < maxNumber}
      />
    </View>
  );
}
