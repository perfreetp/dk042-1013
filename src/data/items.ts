import type { Item } from '@/types'

export const mockItems: Item[] = [
  {
    id: '1',
    type: 'found',
    category: 'electronics',
    title: '捡到一部黑色iPhone 14手机',
    description: '今天早上在小区北门保安亭附近捡到一部黑色iPhone 14，手机壳是蓝色的，有需要请联系。',
    color: '黑色',
    location: '北门保安亭',
    building: '小区北门',
    time: '2024-01-15 08:30',
    images: ['https://picsum.photos/id/1/400/400'],
    contact: '138****8888',
    contactName: '王师傅',
    publisher: '王师傅',
    publisherAvatar: 'https://picsum.photos/id/64/100/100',
    status: 'active',
    createdAt: '2024-01-15T08:30:00Z',
    viewCount: 156,
    messageCount: 12,
    isHot: true
  },
  {
    id: '2',
    type: 'lost',
    category: 'keys',
    title: '丢失一串钥匙，上面有小熊挂件',
    description: '昨天下午在3号楼附近丢失一串钥匙，大约有5把钥匙，挂着一个棕色小熊挂件，非常重要，麻烦捡到的联系我！',
    color: '银色',
    location: '3号楼单元门',
    building: '3号楼',
    time: '2024-01-14 16:00',
    images: ['https://picsum.photos/id/6/400/400'],
    contact: '139****6666',
    contactName: '李女士',
    publisher: '李女士',
    publisherAvatar: 'https://picsum.photos/id/91/100/100',
    status: 'active',
    createdAt: '2024-01-14T16:00:00Z',
    viewCount: 89,
    messageCount: 5
  },
  {
    id: '3',
    type: 'found',
    category: 'documents',
    title: '捡到身份证一张',
    description: '在小区花园捡到一张身份证，姓名张某某，请失主联系认领，需要核实身份信息。',
    color: '白色',
    location: '中心花园',
    building: '小区中心',
    time: '2024-01-15 10:00',
    images: ['https://picsum.photos/id/20/400/400'],
    contact: '137****5555',
    contactName: '赵大爷',
    publisher: '赵大爷',
    publisherAvatar: 'https://picsum.photos/id/177/100/100',
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
    viewCount: 234,
    messageCount: 8,
    isHot: true
  },
  {
    id: '4',
    type: 'lost',
    category: 'pets',
    title: '寻找走失的橘猫，名叫咪咪',
    description: '我家橘猫咪咪今天早上从5号楼家里跑出去了，脖子上有红色项圈，胆子小，看到请联系我，必有重谢！',
    color: '橘色',
    location: '5号楼附近',
    building: '5号楼',
    time: '2024-01-15 07:00',
    images: ['https://picsum.photos/id/237/400/400'],
    contact: '136****7777',
    contactName: '陈小姐',
    publisher: '陈小姐',
    publisherAvatar: 'https://picsum.photos/id/338/100/100',
    status: 'active',
    createdAt: '2024-01-15T07:00:00Z',
    viewCount: 312,
    messageCount: 25,
    isHot: true
  },
  {
    id: '5',
    type: 'found',
    category: 'bags',
    title: '地下车库捡到一个黑色双肩包',
    description: '在B2层地下车库E区捡到一个黑色双肩包，内有笔记本电脑和一些文件，请失主联系说明包内物品。',
    color: '黑色',
    location: 'B2车库E区',
    building: '地下车库',
    time: '2024-01-14 20:00',
    images: ['https://picsum.photos/id/103/400/400'],
    contact: '135****9999',
    contactName: '孙保安',
    publisher: '孙保安',
    publisherAvatar: 'https://picsum.photos/id/1027/100/100',
    status: 'active',
    createdAt: '2024-01-14T20:00:00Z',
    viewCount: 178,
    messageCount: 6
  },
  {
    id: '6',
    type: 'lost',
    category: 'cards',
    title: '丢失门禁卡和交通卡',
    description: '昨天在小区内丢失一张门禁卡和一张交通卡，门禁卡套是蓝色的，交通卡上有贴纸，急！',
    color: '蓝色',
    location: '不确定',
    building: '全小区',
    time: '2024-01-14 18:00',
    images: ['https://picsum.photos/id/3/400/400'],
    contact: '134****3333',
    contactName: '周先生',
    publisher: '周先生',
    publisherAvatar: 'https://picsum.photos/id/1025/100/100',
    status: 'active',
    createdAt: '2024-01-14T18:00:00Z',
    viewCount: 67,
    messageCount: 3
  },
  {
    id: '7',
    type: 'found',
    category: 'accessories',
    title: '捡到一副近视眼镜',
    description: '在小区健身区捡到一副黑框近视眼镜，眼镜盒是棕色的，请到物业办公室认领。',
    color: '黑色',
    location: '健身区',
    building: '健身中心',
    time: '2024-01-13 19:00',
    images: ['https://picsum.photos/id/119/400/400'],
    contact: '133****2222',
    contactName: '物业前台',
    publisher: '物业前台',
    publisherAvatar: 'https://picsum.photos/id/1012/100/100',
    status: 'active',
    createdAt: '2024-01-13T19:00:00Z',
    viewCount: 45,
    messageCount: 2
  },
  {
    id: '8',
    type: 'lost',
    category: 'clothes',
    title: '丢失一件藏蓝色羽绒服',
    description: '昨天在儿童乐园丢失一件儿童藏蓝色羽绒服，品牌是波司登，左胸口有小熊标志。',
    color: '藏蓝色',
    location: '儿童乐园',
    building: '儿童乐园',
    time: '2024-01-14 15:00',
    images: ['https://picsum.photos/id/225/400/400'],
    contact: '132****1111',
    contactName: '吴妈妈',
    publisher: '吴妈妈',
    publisherAvatar: 'https://picsum.photos/id/1014/100/100',
    status: 'active',
    createdAt: '2024-01-14T15:00:00Z',
    viewCount: 56,
    messageCount: 4
  },
  {
    id: '9',
    type: 'found',
    category: 'other',
    title: '捡到儿童玩具车',
    description: '在2号楼楼下捡到一辆红色玩具小汽车，看起来比较新，应该是小朋友丢的。',
    color: '红色',
    location: '2号楼楼下',
    building: '2号楼',
    time: '2024-01-15 09:00',
    images: ['https://picsum.photos/id/160/400/400'],
    contact: '131****0000',
    contactName: '张阿姨',
    publisher: '张阿姨',
    publisherAvatar: 'https://picsum.photos/id/1027/100/100',
    status: 'active',
    createdAt: '2024-01-15T09:00:00Z',
    viewCount: 34,
    messageCount: 1
  },
  {
    id: '10',
    type: 'lost',
    category: 'electronics',
    title: '丢失蓝牙耳机一副',
    description: '可能在小区南门到1号楼的路上丢失，AirPods Pro，白色充电盒，刻有名字缩写。',
    color: '白色',
    location: '南门-1号楼',
    building: '1号楼',
    time: '2024-01-15 08:00',
    images: ['https://picsum.photos/id/9/400/400'],
    contact: '130****1234',
    contactName: '郑先生',
    publisher: '郑先生',
    publisherAvatar: 'https://picsum.photos/id/1005/100/100',
    status: 'active',
    createdAt: '2024-01-15T08:00:00Z',
    viewCount: 78,
    messageCount: 6
  }
]

export const getFoundItems = (): Item[] => {
  return mockItems.filter(item => item.type === 'found')
}

export const getLostItems = (): Item[] => {
  return mockItems.filter(item => item.type === 'lost')
}

export const getHotItems = (): Item[] => {
  return mockItems.filter(item => item.isHot)
}

export const getItemById = (id: string): Item | undefined => {
  return mockItems.find(item => item.id === id)
}

export const getSimilarItems = (id: string, limit: number = 4): Item[] => {
  const current = mockItems.find(item => item.id === id)
  if (!current) return []
  return mockItems
    .filter(item => item.id !== id && item.category === current.category)
    .slice(0, limit)
}
