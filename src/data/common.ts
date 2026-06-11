import type { HotLocation, Comment } from '@/types'

export const hotLocations: HotLocation[] = [
  { name: '北门保安亭', count: 23, icon: '🚪' },
  { name: '中心花园', count: 18, icon: '🌸' },
  { name: '地下车库', count: 15, icon: '🚗' },
  { name: '健身中心', count: 12, icon: '🏋️' },
  { name: '儿童乐园', count: 10, icon: '🎠' },
  { name: '快递柜旁', count: 8, icon: '📦' }
]

export const mockComments: Comment[] = [
  {
    id: 'c1',
    userId: 'u1',
    userName: '热心邻居',
    userAvatar: 'https://picsum.photos/id/64/100/100',
    content: '我昨天下午在3号楼附近好像看到过，你可以去问问楼管阿姨',
    time: '2小时前',
    isClue: true
  },
  {
    id: 'c2',
    userId: 'u2',
    userName: '3号楼住户',
    userAvatar: 'https://picsum.photos/id/91/100/100',
    content: '小熊挂件的钥匙我好像在单元门旁边的花坛边见过',
    time: '1小时前',
    isClue: true
  },
  {
    id: 'c3',
    userId: 'u3',
    userName: '物业小李',
    userAvatar: 'https://picsum.photos/id/177/100/100',
    content: '已经登记了，我们保安巡逻时也会帮忙留意的',
    time: '30分钟前'
  }
]
