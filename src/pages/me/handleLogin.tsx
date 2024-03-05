import React, { useEffect, useState } from 'react';
import { Text, View } from '@tarojs/components'
import { AtAvatar, AtButton, AtCard, AtModal, AtModalHeader, AtModalContent, AtModalAction, AtDivider, AtList, AtListItem } from 'taro-ui';
import { BaseUrl } from '../../config';
import EditCate from './editCategory';
import Taro, { useDidShow } from '@tarojs/taro';


export default function HandleLogin () {
  const [userdata, setUserdata] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const token = wx.getStorageSync('token') || ''
  const [role, setRole] = useState('')
  const [isRelogin, setIsrelogin] = useState(false)
  const [isAddModal, setIsAddModal] = useState(false)
  
  // 验证token
  useDidShow(() => {
    const storedUserData = wx.getStorageSync('userdata')
    
    if (token && storedUserData) {
      setIsLoggedIn(true);
      setUserdata(storedUserData)
    }

    if (token) {
      wx.request({
        url: `${BaseUrl}/users/auth`,
        method: 'GET',
        header: {
        'Authorization': `Bearer${token}`
      },
      success() {  
      },
      complete(res) {        
        if (res.data!== '已登录') {   
          logout()
          setIsrelogin(true)
        }
        
      }
    })
    }
    
  })

  const login = () =>{
    wx.getUserProfile({
      lang: 'zh_CN',
      desc: 'login',
      success(res) {
        const {encryptedData, iv} = res;
        wx.login({
          success(res) {
            wx.showLoading({
              title: '登录中',
              mask: true // 显示透明蒙层，防止触摸穿透
            });
            wx.request({
              url: `${BaseUrl}/users/login`,
              method: 'POST',
              dataType: 'json',
              responseType: 'text',
              header: {
                'content-type': 'application/json'
              },
              data: {
                code: res.code,
                iv,
                encryptedData
              },
              success: (res) => {                                
                if (res.statusCode === 200) {                  
                  wx.showToast({
                    title:'登录成功'
                  })
                const responseData = res.data as Record<string, any>
                const token = responseData.token;
                wx.setStorageSync('token', token);
                setUserdata(responseData.userdata)
                wx.setStorageSync('userdata', responseData.userdata)
                setIsLoggedIn(true);
                setRole(responseData.role)
                } else if (res.statusCode === 500) {
                  wx.showToast({
                    title:'登录失败'
                  });
                  console.log('登录失败！' + res.errMsg);
                }
              },
              fail: () => {
                wx.hideLoading();
                wx.showToast({
                  title:'登录失败'
                })
              },
              complete: () => {
                wx.hideLoading();
              },
            });
            }
          }
        )
      }
    })
  }
  
  const logout = () => {
    wx.removeStorageSync('token');
    wx.removeStorageSync('userdata');
    wx.removeStorageSync('editmode')
    setIsLoggedIn(false);
    setRole('')
  }

  function HandleEditClick() {
    Taro.switchTab({url: '../index/index'})
    wx.setStorageSync('editmode', true);
  }

  return (
    <View>
      <AtCard title="个人信息">
      {!isLoggedIn ? (<AtButton onClick={login}>登录</AtButton>) : (
        <>
        <View style={{ display: 'flex', alignItems: 'center' }}>
          <AtAvatar image={userdata.avatarUrl} size="large" circle></AtAvatar>
          <Text style={{ marginLeft: '10px' }}>{userdata.nickName}</Text>
        </View>
        <AtButton onClick={logout}>登出</AtButton>
      </>
      ) }
      <AtModal isOpened={isRelogin}>
        <AtModalHeader>登录</AtModalHeader>
        <AtModalContent>
          请重新登录
        </AtModalContent>
        <AtModalAction> <AtButton onClick={() => setIsrelogin(false)}>取消</AtButton> <AtButton onClick={() => { setIsrelogin(false); login(); }}>重试</AtButton> </AtModalAction>
      </AtModal>
    </AtCard>
    
    {/* 调试阶段 */}
    {/* { role === 'admin' && ( <View> */}
      <AtDivider content='管理员可见'></AtDivider>
      <AtList>
        <AtListItem title="添加分类" arrow="right" onClick={() => setIsAddModal(true)} />
        <AtListItem title="编辑分类" arrow="right" onClick={HandleEditClick} />
      </AtList>
      <EditCate isAddModal={isAddModal} setIsAddModal={setIsAddModal}/>
    {/* </View>) */}
    {/* // } */}
    </View>
  )
}