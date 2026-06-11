import type { Notice } from '@/types'

export const mockNotices: Notice[] = [
  {
    id: 'n1',
    title: '关于加强小区失物招领管理的通知',
    content: '为规范小区失物招领管理，物业将对所有发布信息进行审核，请大家发布时如实填写信息。虚假信息将被下架并记入信用档案。',
    publisher: '物业管理处',
    createdAt: '2024-01-10',
    isTop: true
  },
  {
    id: 'n2',
    title: '春节期间失物招领服务时间调整',
    content: '春节期间（2月9日-2月17日）失物招领服务时间调整为：9:00-17:00，紧急情况请拨打物业值班电话。',
    publisher: '物业管理处',
    createdAt: '2024-01-08',
    isTop: true
  },
  {
    id: 'n3',
    title: '本月失物招领统计',
    content: '本月共收到失物招领信息45条，成功找回物品23件，找回率51%。感谢大家的热心帮助！',
    publisher: '物业管理处',
    createdAt: '2024-01-05'
  },
  {
    id: 'n4',
    title: '捡到物品请到物业登记',
    content: '捡到物品的住户请到物业服务中心登记，我们会帮助发布招领信息，让失主尽快找回物品。',
    publisher: '物业服务中心',
    createdAt: '2024-01-03'
  }
]
