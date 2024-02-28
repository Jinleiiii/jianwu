import { Component } from 'react'
import Taro from '@tarojs/taro'
import { CoverView, CoverImage } from '@tarojs/components'
import './index.scss'

export default class Index extends Component {
  state = {
    selected: 0,
    color: '#000000',
    selectedColor: '#DC143C',
    list: [
      {
        pagePath: '/pages/index/index',
        selectedIconPath: '../assets/images/tabbar_cart_on.png',
        iconPath: '../assets/images/tabbar_cart.png',
        text: '首页'
      },
      {
        pagePath: '/pages/me/index',
        selectedIconPath: '../assets/images/tabbar_my_on.png',
        iconPath: '../assets/images/tabbar_my.png',
        text: '个人中心'
      }
    ]
  }

  switchTab(index, url) {
    this.setSelected(index)
    Taro.switchTab({ url })
  }

  setSelected (idx: number) {
    this.setState({
      selected: idx
    })
  }

  render() {
    const { list, selected, color, selectedColor } = this.state

    return (
      <CoverView className='tab-bar'>
        <CoverView className='tab-bar-border'></CoverView>
        {list.map((item, index) => {
          return (
            <CoverView key={index} className='tab-bar-item' onClick={this.switchTab.bind(this, index, item.pagePath)}>
              <CoverImage src={selected === index ? item.selectedIconPath : item.iconPath} />
              <CoverView style={{ color: selected === index ? selectedColor : color }}>{item.text}</CoverView>
            </CoverView>
          )
        })}
      </CoverView>
    )
  }
}