import { AtList, AtListItem, AtCard, AtButton, AtDivider } from 'taro-ui'
import Taro, { useDidShow } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { Component } from 'react'
import type CustomTabBar from '../../custom-tab-bar'
import EditCate from './editCategory'

export default class Index extends Component {
  state = {
    isModalOpen: false,
  }

  setIsModalOpen = (isOpen) => {
    this.setState({isModalOpen: isOpen})
  }
  pageCtx = Taro.getCurrentInstance().page

  componentDidShow () {
    const tabbar = Taro.getTabBar<CustomTabBar>(this.pageCtx)
    tabbar?.setSelected(1)
  }

  render () {
    const {isModalOpen} = this.state;
    return (
      <View className='index'>
        <AtCard title="个人信息">
        {/* 个人信息内容 */}
      </AtCard>

      <AtList>
        <AtListItem title="我的订单" arrow="right" onClick={() => {/* 导航到购物车页面 */}} />
      </AtList>

      <AtDivider content='管理员可见'></AtDivider>
      <AtList>
        <AtListItem title="编辑分类" arrow="right" onClick={() => this.setIsModalOpen(true)} />
      </AtList>
      <EditCate isModalOpen={isModalOpen} setIsModalOpen={this.setIsModalOpen}/>
      </View>
    )
  }
}