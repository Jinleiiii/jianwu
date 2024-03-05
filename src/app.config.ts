export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/me/index',
    'pages/items/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar:{
    custom: true,
    color: 'rgba(0, 0, 0, 0.6)',
    selectedColor: 'rgba(0, 162, 0, 1)',
    backgroundColor: '#fff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: './assets/images/tabbar_cart.png',
        selectedIconPath: './assets/images/tabbar_cart_on.png'
      },
      {
        pagePath: 'pages/me/index',
        text: '我的',
        iconPath: './assets/images/tabbar_my.png',
        selectedIconPath: './assets/images/tabbar_my_on.png'
      }
    ]
  }
})
