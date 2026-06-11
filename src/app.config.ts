export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/publish/index',
    'pages/search/index',
    'pages/message/index',
    'pages/mine/index',
    'pages/detail/index',
    'pages/claim/index',
    'pages/notice/index',
    'pages/report/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FF7D00',
    navigationBarTitleText: '小区失物招领',
    navigationBarTextStyle: 'white',
    backgroundColor: '#FFF8F0'
  },
  tabBar: {
    color: '#86909C',
    selectedColor: '#FF7D00',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/search/index',
        text: '搜索'
      },
      {
        pagePath: 'pages/publish/index',
        text: '发布'
      },
      {
        pagePath: 'pages/message/index',
        text: '消息'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的'
      }
    ]
  }
})
