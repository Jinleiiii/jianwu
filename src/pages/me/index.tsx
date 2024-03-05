import { AtList, AtListItem, AtCard, AtButton, AtDivider } from 'taro-ui'
import Taro, { useDidShow } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { Component, createContext } from 'react'
import type CustomTabBar from '../../custom-tab-bar'
import HandleLogin from './handleLogin'


export default class Index extends Component {
  pageCtx = Taro.getCurrentInstance().page

  componentDidShow () {
    const tabbar = Taro.getTabBar<CustomTabBar>(this.pageCtx)
    tabbar?.setSelected(1)
  }

  render () {
    return (
      <View className='index'>
          <HandleLogin />

      <AtList>
        <AtListItem title="我的订单" arrow="right" onClick={() => {/* 导航到购物车页面 */}} />
      </AtList>

      </View>
    )
  }
}