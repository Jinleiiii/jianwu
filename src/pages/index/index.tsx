import { View, Text, Swiper, SwiperItem, Image } from '@tarojs/components'
import swiperLock from 'src/assets/images/swiper_lock1.jpeg'
import swiperHelmet from 'src/assets/images/swiper_helmet.jpeg'
import swiperWelcome from 'src/assets/images/swiper_welcome.png'
import Taro, { useLoad } from '@tarojs/taro'
import React, {Component} from 'react'
import './index.scss'
import type CustomTabBar from '../../custom-tab-bar'
import CateContent from './cate'
export default class Index extends Component {

  pageCtx = Taro.getCurrentInstance().page;

  componentDidShow () {
    const tabbar = Taro.getTabBar<CustomTabBar>(this.pageCtx)
    tabbar?.setSelected(0)
  }

  render () {
    return (
    <View className='content'>
      <View>
          <Swiper indicatorDots indicatorActiveColor = '#999'  style={{width: '90%', height:'200px', margin:'0 auto'}}>
       <SwiperItem className='swiper-item'>
        <Image src={swiperWelcome} className='swiper-image'></Image>
      </SwiperItem>
      <SwiperItem className='swiper-item'>
        <Image src={swiperLock} className='swiper-image'></Image>
      </SwiperItem>
      <SwiperItem className='swiper-item' >
        <Image src={swiperHelmet} className='swiper-image'></Image>
      </SwiperItem>
    </Swiper>
      </View>
      <View>
        <CateContent />
      </View>
    </View>
  )
  }
}