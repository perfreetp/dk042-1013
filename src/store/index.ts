import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Item, Message, Notice, UserProfile, Comment } from '@/types'
import type { ItemStatus } from '@/types'
import { mockItems } from '@/data/items'
import { mockMessages } from '@/data/messages'
import { mockNotices } from '@/data/notices'

interface Report {
  id: string
  itemId: string
  itemTitle: string
  reason: string
  description: string
  reporter: string
  reporterPhone: string
  status: 'pending' | 'resolved' | 'rejected'
  createdAt: string
  images?: string[]
}

interface AppState {
  items: Item[]
  messages: Message[]
  notices: Notice[]
  reports: Report[]
  currentUser: UserProfile
  addItem: (item: Omit<Item, 'id' | 'createdAt' | 'status' | 'viewCount' | 'messageCount' | 'publisher'>) => void
  updateItemStatus: (id: string, status: ItemStatus) => void
  addComment: (itemId: string, comment: Comment) => void
  incrementViewCount: (id: string) => void
  addReport: (report: Omit<Report, 'id' | 'status' | 'createdAt'>) => void
  updateReportStatus: (id: string, status: 'resolved' | 'rejected') => void
  setCurrentUser: (user: Partial<UserProfile>) => void
  switchRole: (role: 'resident' | 'security' | 'property') => void
  getPendingItems: () => Item[]
  getExpiredItems: () => Item[]
  getPendingReports: () => Report[]
  getMyItems: () => Item[]
  getClaims: () => Item[]
  markMessageRead: (id: string) => void
}

const initialUser: UserProfile = {
  id: 'u1',
  name: '张先生',
  avatar: 'https://picsum.photos/id/64/200/200',
  phone: '138****8888',
  building: '3号楼2单元1502室',
  role: 'resident',
  publishCount: 5,
  foundCount: 3,
  thankCount: 2
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      items: mockItems,
      messages: mockMessages,
      notices: mockNotices,
      reports: [
        {
          id: 'report_1',
          itemId: '1',
          itemTitle: '捡到一部黑色iPhone 14手机',
          reason: 'fake',
          description: '这个信息是假的，我看到是他自己的手机，故意发布骗悬赏金',
          reporter: '刘先生',
          reporterPhone: '138****1234',
          status: 'pending',
          createdAt: '2024-01-15T11:00:00Z'
        },
        {
          id: 'report_2',
          itemId: '5',
          itemTitle: '地下车库捡到一个黑色双肩包',
          reason: 'duplicate',
          description: '这条信息和另一条重复了',
          reporter: '陈女士',
          reporterPhone: '139****5678',
          status: 'pending',
          createdAt: '2024-01-15T10:30:00Z'
        }
      ],
      currentUser: initialUser,

      addItem: (itemData) => {
        const newItem: Item = {
          ...itemData,
          id: `item_${Date.now()}`,
          createdAt: new Date().toISOString(),
          status: 'pending',
          viewCount: 0,
          messageCount: 0,
          publisher: get().currentUser.name,
          publisherAvatar: get().currentUser.avatar,
          publisherPhone: get().currentUser.phone,
          time: itemData.lostTime || '未填写',
          comments: []
        }
        set((state) => ({
          items: [newItem, ...state.items],
          currentUser: {
            ...state.currentUser,
            publishCount: state.currentUser.publishCount + 1
          }
        }))
      },

      updateItemStatus: (id, status) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, status } : item
          )
        }))
      },

      addComment: (itemId, comment) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  messageCount: item.messageCount + 1,
                  comments: [...(item.comments || []), comment]
                }
              : item
          )
        }))
      },

      incrementViewCount: (id) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, viewCount: item.viewCount + 1 } : item
          )
        }))
      },

      addReport: (reportData) => {
        const newReport: Report = {
          ...reportData,
          id: `report_${Date.now()}`,
          status: 'pending',
          createdAt: new Date().toISOString()
        }
        set((state) => ({
          reports: [newReport, ...state.reports]
        }))
      },

      updateReportStatus: (id, status) => {
        set((state) => ({
          reports: state.reports.map((report) =>
            report.id === id ? { ...report, status } : report
          )
        }))
      },

      setCurrentUser: (user) => {
        set((state) => ({
          currentUser: { ...state.currentUser, ...user }
        }))
      },

      switchRole: (role) => {
        set((state) => ({
          currentUser: {
            ...state.currentUser,
            role,
            name: role === 'property' ? '物业管理员' : role === 'security' ? '保安李师傅' : '张先生',
            avatar: role === 'property' 
              ? 'https://picsum.photos/id/177/200/200'
              : role === 'security'
                ? 'https://picsum.photos/id/1027/200/200'
                : 'https://picsum.photos/id/64/200/200'
          }
        }))
      },

      getPendingItems: () => {
        return get().items.filter((item) => item.status === 'pending')
      },

      getExpiredItems: () => {
        return get().items.filter((item) => {
          const created = new Date(item.createdAt).getTime()
          const now = Date.now()
          const days = (now - created) / (1000 * 60 * 60 * 24)
          return days > 14 && item.status === 'active'
        })
      },

      getPendingReports: () => {
        return get().reports.filter((report) => report.status === 'pending')
      },

      getMyItems: () => {
        return get().items.filter(
          (item) => item.publisher === get().currentUser.name
        )
      },

      getClaims: () => {
        return get().items.filter((item) => item.status === 'claimed')
      },

      markMessageRead: (id) => {
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === id ? { ...msg, unread: false } : msg
          )
        }))
      }
    }),
    {
      name: 'lost-found-storage'
    }
  )
)

export type { Report }
