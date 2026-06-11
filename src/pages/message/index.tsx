import React, { useState, useMemo } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import classnames from 'classnames'
import { mockMessages } from '@/data/messages'
import type { Message } from '@/types'

type TabType = 'all' | 'system' | 'chat' | 'claim'

const MessagePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('all')
  const [messages, setMessages] = useState<Message[]>(mockMessages)

  const filteredMessages = useMemo(() => {
    if (activeTab === 'all') return messages
    return messages.filter(m => m.type === activeTab)
  }, [messages, activeTab])

  const tabUnreadCounts = useMemo(() => {
    return {
      all: messages.filter(m => m.unread).length,
      system: messages.filter(m => m.type === 'system' && m.unread).length,
      chat: messages.filter(m => m.type === 'chat' && m.unread).length,
      claim: messages.filter(m => m.type === 'claim' && m.unread).length
    }
  }, [messages])

  const handleMessageClick = (msg: Message) => {
    if (msg.itemId) {
      Taro.navigateTo({
        url: `/pages/detail/index?id=${msg.itemId}`
      })
    }
  }

  const getAvatarContent = (type: string) => {
    switch (type) {
      case 'system':
        return '📢'
      case 'claim':
        return '🎁'
      case 'chat':
        return '💬'
      default:
        return '📩'
    }
  }

  const getAvatarClass = (type: string) => {
    switch (type) {
      case 'system':
        return styles.systemAvatar
      case 'claim':
        return styles.claimAvatar
      default:
        return styles.chatAvatar
    }
  }

  return (
    <View className={styles.page}>
      <View className={styles.tabBar}>
        {[
          { key: 'all', label: '全部' },
          { key: 'system', label: '系统' },
          { key: 'chat', label: '私信' },
          { key: 'claim', label: '认领' }
        ].map(tab => (
          <View
            key={tab.key}
            className={classnames(styles.tabItem, activeTab === tab.key && styles.active)}
            onClick={() => setActiveTab(tab.key as TabType)}
          >
            {tab.label}
            {tabUnreadCounts[tab.key as keyof typeof tabUnreadCounts] > 0 && (
              <View className={styles.unreadDot}>
                {tabUnreadCounts[tab.key as keyof typeof tabUnreadCounts]}
              </View>
            )}
          </View>
        ))}
      </View>

      <View className={styles.messageList}>
        {filteredMessages.length > 0 ? (
          filteredMessages.map(msg => (
            <View
              key={msg.id}
              className={styles.messageCard}
              onClick={() => handleMessageClick(msg)}
            >
              <View className={classnames(styles.avatarWrapper, getAvatarClass(msg.type))}>
                {msg.avatar ? (
                  <Image className={styles.avatar} src={msg.avatar} mode='aspectFill' />
                ) : (
                  <Text>{getAvatarContent(msg.type)}</Text>
                )}
              </View>
              <View className={styles.content}>
                <View className={styles.header}>
                  <Text className={styles.title}>{msg.title}</Text>
                  <Text className={styles.time}>{msg.time}</Text>
                </View>
                <Text className={styles.preview}>{msg.content}</Text>
                {msg.itemTitle && (
                  <View className={styles.itemLink}>📌 相关物品：{msg.itemTitle}</View>
                )}
              </View>
              {msg.unread && <View className={styles.unreadBadge} />}
            </View>
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📭</Text>
            <Text className={styles.emptyText}>暂无消息</Text>
          </View>
        )}
      </View>
    </View>
  )
}

export default MessagePage
