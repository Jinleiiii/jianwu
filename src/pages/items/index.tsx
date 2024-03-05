import {Text, View, Image} from "@tarojs/components"
import Taro, { useDidShow } from "@tarojs/taro"
import { useState } from "react"
import { AtButton, AtIcon } from "taro-ui"
import {BaseUrl} from "../../config"
import PostItem from './postItem'
import defaultPic from 'src/assets/images/default_pic.jpeg'
import './index.css'

interface Item {
  categoryId: string;
  id: string;
  image: string[];
  name: string;
}

export default function ShowItemInfo() {
  const editMode = wx.getStorageSync('editmode')
  const [itemsInfo, setItemsInfo] = useState<Item[]>([])
  const cateid = Taro.getCurrentInstance().router?.params.cateid
  const [isAddModal, setIsAddModal] = useState(false)
  const token = wx.getStorageSync('token')

  const fetchItemsInfo = async (id) => {
    Taro.request({
      url: `${BaseUrl}/categories/${id}`,
      method: 'GET',
      header: {
        'content-type': 'multipart/form-data',
      },
      success: (res) => {
        setItemsInfo(res.data)
      }
    })
  }  

  useDidShow(() => {
    fetchItemsInfo(cateid)
  })

  
  const handleEdit = () => {
    setIsAddModal(true)
    fetchItemsInfo(cateid)
  }
  
  const handleItemDelete = (id) => {
    Taro.request({
      url: `${BaseUrl}/items/${id}`,
      method: 'DELETE',
      header: {
        'Authorization': `Bearer${token}`,
      },
      success: (res) => {        
        if (res.statusCode === 200) {
          Taro.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 2000
          });
          fetchItemsInfo(cateid)
        } else if (res.statusCode === 401) {
          Taro.showToast({
            title: '请重新登录',
            icon: 'none',
            duration: 2000
        });
        Taro.switchTab({url: '/pages/me/index'})
       } else {
          Taro.showToast({
            title: '删除失败',
            icon: 'none',
            duration: 2000
          });
        }
      },
      fail: () => {
        Taro.showToast({
          title: '操作异常',
          icon: 'none',
          duration: 2000
        });
      }
    })
  }

  return (
    <View>
      {editMode && (
        <AtButton onClick={handleEdit}>添加商品</AtButton>
      )} 
      <PostItem isAddModal={isAddModal} setIsAddModal={setIsAddModal} categoryid={cateid}/>
      <View className="grid-container">
      {itemsInfo.map((item, index) => (
        <View className="grid-item" key={index}>
          <Image
            className="grid-item-image"
            mode="aspectFill"
            // src={item.image[0]}
            src={defaultPic}
          />
          <Text className="grid-item-text">{item.name}</Text>
          {editMode && <AtIcon value='trash' size='20' color='#000' onClick={() => handleItemDelete(item.id)}></AtIcon>}
        </View>
        
      ))}
      </View>
    </View>
  )
}