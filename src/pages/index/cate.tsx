import Taro, { useDidShow } from '@tarojs/taro'
import React, { useEffect, useState } from 'react'
import './index.scss'
import { View, Text, Image } from '@tarojs/components'
import { BaseUrl } from '../../config';
import { AtButton, AtIcon } from 'taro-ui';
import PatchCate from './patchCategory';
import defaultPic from 'src/assets/images/default_pic.jpeg'

interface Category {
  _id: string;
  name: string;
  categoryImage: string[];
}

async function fetchCategories() {
  const res = await Taro.request({
    url: `${BaseUrl}/categories`,
    method: 'GET',
    header: {
      'content-type': 'application/json'
    },
  });

  if (res.statusCode === 200) {
      return res.data;
    } else {
      throw new Error('服务器错误，状态码：' + res.statusCode)
    }
}

export default function CateContent() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editMode, setEditMode] = useState(false)
  const [isAddModal, setIsAddModal] = useState(false)
  const [currentCategory, setCurrentCategory] = useState({id: '', name: ''})
  const token = wx.getStorageSync('token')
  const [isLoaded, setIsLoaded] = useState(false);
  // 类似useEffect + componentDidUpdate 页面每次显示时调用 特别针对小程序（普通React中无效）
  useDidShow(() => {
    const mode = wx.getStorageSync('editmode');
    setEditMode(mode);
    const fetchData = async () => {
      const data = await fetchCategories();
      setCategories(data);
      setIsLoaded(true);
      
    };
    fetchData();
  });
  
  const handleEdit = async (id, name) => {
    setCurrentCategory({id: id, name: name})
    setIsAddModal(true)
  }
  

  const handleDelete = async (id) => {
    const response = await Taro.request({
      url: `${BaseUrl}/categories/${id}`,
      method: 'DELETE',
      header: {
        'Authorization': `Bearer${token}`,
      }
    });    
    if (response.statusCode === 200) {
      Taro.showToast({
        title: '类别删除成功',
        icon: 'success', 
        duration: 2000 
      });
      const fetchData = async () => {
      const data = await fetchCategories();
      setCategories(data);
      };
      fetchData();
    } else if (response.statusCode === 401) {
        Taro.showToast({
          title: '请重新登录',
          icon: 'none',
          duration: 2000
      });
      Taro.switchTab({url: '/pages/me/index'})
     } else {
      Taro.showToast({
        title: '删除失败，请重试',
        icon: 'none', 
        duration: 2000
      });
  }
}

  const handleCompleteEdit = () => {
    wx.setStorageSync('editmode', false);
    setEditMode(false)
    const fetchData = async () => {
      const data = await fetchCategories();
      setCategories(data);
      };
      fetchData();
  }
  
  const showItems = (cateid) => {
    Taro.navigateTo({url: `/pages/items/index?cateid=${cateid}`})
  }
  
  
  return (
    <View>
      {!isLoaded ? <View>Loading...</View> : 
      <View className='categories-container'>
        {categories.map((category) => (                    
          <View key={category._id} className='category-item'>
            <Image
              lazyLoad
              style={{ width: '100%', height: '100px' }} 
              // src={category.categoryImage[0]}
              src={defaultPic}
              mode='aspectFill'
              onClick={() => {showItems(category._id)}}
            />
            <Text>{category.name}</Text>
            {editMode && (
              <View>
                <AtIcon value='edit' size='20' color='#000' onClick={() => {handleEdit(category._id, category.name)}}></AtIcon>
                <PatchCate isAddModal={isAddModal} setIsAddModal={setIsAddModal} categoryid={currentCategory.id} catename={currentCategory.name}/>
                <AtIcon value='trash' size='20' color='#000' onClick={() => handleDelete(category._id)}></AtIcon>
              </View>
            )}
          </View>
        ))}
      </View>
      }
      
      {editMode && (
        <AtButton className='edit-button' onClick = {handleCompleteEdit}>编辑完成</AtButton>
      )}
    </View>
  )
}
