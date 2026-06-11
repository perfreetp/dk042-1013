import type { Message } from '@/types'

export const mockMessages: Message[] = [
  {
    id: 'm1',
    type: 'system',
    title: '系统通知',
    content: '您发布的"丢失一串钥匙"已有3人留言提供线索',
    time: '10分钟前',
    unread: true
  },
  {
    id: 'm2',
    type: 'claim',
    title: '认领申请通知',
    content: '您发布的"捡到一部黑色iPhone"收到新的认领申请',
    time: '1小时前',
    unread: true,
    itemId: '1',
    itemTitle: '捡到一部黑色iPhone 14手机'
  },
  {
    id: 'm3',
    type: 'chat',
    title: '李女士',
    content: '你好，请问钥匙上有几把钥匙？我的是5把钥匙',
    avatar: 'https://picsum.photos/id/91/100/100',
    time: '2小时前',
    unread: false
  },
  {
    id: 'm4',
    type: 'system',
    title: '审核通过',
    content: '您发布的寻物启事已通过物业审核，正在展示中',
    time: '昨天',
    unread: false
  },
  {
    id: 'm5',
    type: 'claim',
    title: '认领成功',
    content: '恭喜！您的认领申请已通过，物品已找回',
    time: '3天前',
    unread: false,
    itemId: '6',
    itemTitle: '丢失门禁卡和交通卡'
  }
]

export const getUnreadCount = (): number => {
  return mockMessages.filter(m => m.unread).length
}
