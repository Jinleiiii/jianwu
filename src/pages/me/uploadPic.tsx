import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import {View} from '@tarojs/components'
import isFunction from 'lodash/isFunction'
import { PreviewImage } from './previewImage';
import {AtImagePicker, AtButton, AtModalAction, AtInput} from 'taro-ui'

import { BaseUrl } from '../../config';

interface ImageInfo {
  url: string;
  file?: {
    path: string;
    size: number;
  };
}

export const UploadPic: React.FC<any> = ({
  maxNumber = 3, // 最大数量
  fileList = [], // 默认显示图片
  previewAble = true,
  interfaceName = '',
  fileChange,
  setIsModalOpen,
}) => {
  const _accessoryFileList: any[] = [...fileList] // 后端用图片格式 arr
  const [tempImages, setTempImages] = useState([])
  const [form, setForm] = useState({
    name:'',
  })
  const token = wx.getStorageSync('token')
  const onChange = (files, doType, index) => {
    if (doType === 'add') {
      // add file
      const waitingUploadFiles = files.filter(f => !(f.url.includes('oss/')))
      setTempImages(waitingUploadFiles)
    } else {
      // remove file
      _accessoryFileList.splice(index, 1)
      _fileChange(_accessoryFileList);
      const newTempImages = [...tempImages]
      newTempImages.splice(index, 1)
      setTempImages(newTempImages)
    }
  };

  const compressImages = (imageUrls: ImageInfo[]): Promise<string[]> => {
    const compressPromises = imageUrls.map((image) => {
      return Taro.compressImage({
        src: image.url, // 图片路径
        quality: 80 // 压缩质量，这里设定为 80，可根据需要调整
      }).then((result) => result.tempFilePath) // 使用 then() 来提取压缩后的图片路径
        .catch((error) => {
          console.error('压缩图片失败:', image.url, error);
          return image.url; // 压缩失败时返回原始图片路径
        });
    });
  
    // 使用 Promise.all() 来等待所有图片压缩操作完成
    return Promise.all(compressPromises);
  };

  const uploadFile = (data, additionalData) => {
    console.log(data, additionalData);
    let shouldContinueUploading = true;
    
    if (!data.urls || !data.urls[data.i]) {
      Taro.showToast({
        title: '请至少上传一张图片',
        icon: 'none',
        duration: 2000
      });
      return; // 中断执行
    }

    if (!additionalData || Object.keys(additionalData).length === 0) {
      Taro.showToast({
        title: '缺少必要的名称，无法上传',
        icon: 'none',
        duration: 2000
      });
      return; // 中断执行
    }    
    Taro.showLoading({
      title: `正在上传第${data.i + 1}张`
    })
    // 发起上传

    Taro.uploadFile({
      url: `${BaseUrl}/${interfaceName}`,
      header: {
        'content-type': 'multipart/form-data',
        'Authorization': `Bearer${token}`
      },
      name: 'photos',
      filePath: data.urls[data.i],
      formData: {
        ...additionalData, // 这里传入所有额外的数据
      },
      success: (res) => {
        //图片上传成功，图片上传成功的变量+1     
        console.log(res);

        if (res.statusCode === 201) {
          data.success++;
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
        } else if (res.statusCode === 409) {
          // 名称重复错误逻辑
          data.fail++;
          Taro.showToast({
              title: '输入名称重复',
              icon: 'none',
              duration: 2000
          });
          shouldContinueUploading = false;
          setTempImages([]);
          setForm({
            name: '',
          });
        } else if (res.statusCode === 401) {
          data.fail++;
            Taro.showToast({
              title: '请重新登录',
              icon: 'none',
              duration: 2000
          });
          Taro.switchTab({url: '/pages/me/index'})
          shouldContinueUploading = false;
          setTempImages([]);
          setForm({
            name: '',
          });
        } else if (res.statusCode === 413) {
            data.fail++;
            Taro.showToast({
              title: '传入图片过大（需小于5MB）',
              icon: 'none',
              duration: 2000
          });
          shouldContinueUploading = false;
          setTempImages([]);
          setForm({
            name: '',
          });
        } else {
        data.fail++;
          Taro.showToast({
            title: '上传错误，请稍后重试',
            icon: 'none',
            duration: 2000
          });
        }
      },
      fail: (res) => {
        data.fail++;//图片上传失败，图片上传失败的变量+1
        console.log(res);

        Taro.showToast({
          title: '上传失败，请稍后重试',
          icon: 'none',
          duration: 2000
        });
        setTempImages([]);
        setForm({
          name: '',
        });
      },
      complete: () => {
        
        Taro.hideLoading()
        console.log(shouldContinueUploading);
        if (shouldContinueUploading){
          data.i++;//这个图片执行完上传后，开始上传下一张
          console.log(data);

          if (data.i == data.urls.length) {   //当图片传完时，停止调用
            console.log('成功：' + data.success + " 失败：" + data.fail);
            _fileChange(_accessoryFileList);
            console.log('----------------_accessoryFileList', _accessoryFileList)
            Taro.showToast({
              title: '上传完成',
              icon: 'success',
              duration: 2000
            });
            setTempImages([]);
            setForm({
              name: '',
            });
          } else {//若图片还没有传完，则继续调用函数
            
            uploadFile(data, form);
          }
        }
      }  
    })
  }

  const _fileChange = (_accessoryFileList) => {
    isFunction(fileChange) && fileChange(_accessoryFileList);
  };

  const handleInputChange = (value, name) => {
    setForm({
      ...form,
      [name]: value,
    })
  }

  const handleInputSubmit = () => {
    setIsModalOpen(false);
    compressImages(tempImages).then((compressedImageUrls) => {      
      uploadFile({urls:compressedImageUrls, i:0, success:0, fail:0}, form);
    }).catch((error) => {
      console.error('压缩图片过程中出错:', error);
    });

  }

  return (
    <View>
      <AtInput name='name'
            title='分类名称'
            type='text'
            placeholder='请输入分类名称'
            value={form.name}
            onChange={(value) => handleInputChange(value, 'name')}>
      </AtInput>
      <AtImagePicker
        multiple
        length={3}
        count={9}
        files={tempImages}
        onImageClick={(i) => previewAble && PreviewImage(i, fileList)}
        onChange={onChange}
        showAddBtn={fileList.length < maxNumber}
      />
      <AtModalAction>
          <AtButton onClick={() => setIsModalOpen(false)}>取消</AtButton>
          <AtButton onClick={handleInputSubmit}>提交</AtButton>
      </AtModalAction>
    </View>
  );
}
