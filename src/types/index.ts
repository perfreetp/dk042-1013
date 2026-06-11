export type ItemType = 'lost' | 'found'

export type ItemCategory =
  | 'electronics'
  | 'documents'
  | 'keys'
  | 'cards'
  | 'clothes'
  | 'bags'
  | 'accessories'
  | 'pets'
  | 'other'

export type ItemStatus = 'pending' | 'active' | 'claimed' | 'closed' | 'expired'

export interface Item {
  id: string
  type: ItemType
  category: ItemCategory
  title: string
  description: string
  color: string
  location: string
  building: string
  time: string
  lostTime?: string
  images: string[]
  contact: string
  contactName: string
  publisher: string
  publisherAvatar: string
  publisherPhone: string
  status: ItemStatus
  createdAt: string
  viewCount: number
  messageCount: number
  isHot?: boolean
  comments?: Comment[]
}

export interface Message {
  id: string
  type: 'system' | 'chat' | 'claim'
  title: string
  content: string
  avatar?: string
  time: string
  unread: boolean
  itemId?: string
  itemTitle?: string
}

export interface Notice {
  id: string
  title: string
  content: string
  publisher: string
  createdAt: string
  isTop?: boolean
}

export interface Comment {
  id: string
  userId: string
  userName: string
  userAvatar: string
  content: string
  time: string
  isClue?: boolean
}

export interface HotLocation {
  name: string
  count: number
  icon: string
}

export interface UserProfile {
  id: string
  name: string
  avatar: string
  phone: string
  building: string
  role: 'resident' | 'security' | 'property'
  publishCount: number
  foundCount: number
  thankCount: number
}

export const categoryMap: Record<ItemCategory, string> = {
  electronics: '数码电子',
  documents: '证件文件',
  keys: '钥匙',
  cards: '卡类',
  clothes: '衣物',
  bags: '箱包',
  accessories: '配饰',
  pets: '宠物',
  other: '其他'
}

export const categoryList: ItemCategory[] = [
  'electronics',
  'documents',
  'keys',
  'cards',
  'clothes',
  'bags',
  'accessories',
  'pets',
  'other'
]
