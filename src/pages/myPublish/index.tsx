import React, { useState, useMemo } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import classnames from 'classnames'
import { useAppStore } from '@/store'
import type { Item } from '@/types'
import { formatTime } from '@/utils/index'
import { categoryMap } from '@/types'

const MyPublishPage: React.FC = () => {
  const items = useAppStore((state) => state.items)
  const currentUser = useAppStore((state) => state.currentUser)
  const updateItemStatus = useAppStore((state) => state.updateItemStatus)
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'active' | 'closed'>('all')

  const myItems = useMemo(() => {
    return items.filter((item) => item.publisher === currentUser.name)
  }, [items, currentUser.name])

  const filteredItems = useMemo(() => {
    if (activeTab === 'all') {
      return myItems
    }
    return myItems.filter((item) => item.status === activeTab)
  }, [myItems, activeTab])

  const counts = useMemo(() => {
    return {
      all: myItems.length,
      pending: myItems.filter((i) => i.status === 'pending').length,
      active: myItems.filter((i) => i.status === 'active').length,
      closed: myItems.filter((i) => i.status === 'closed' || i.status === 'expired').length
    }
  }, [myItems])

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '审核中'
      case 'active':
        return '展示中'
      case 'claimed':
        return '已认领'
      case 'closed':
        return '已关闭'
      case 'expired':
        return '已过期'
      default:
        return '未知'
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending':
        return styles.pendingTag
      case 'active':
        return styles.activeTag
      case 'claimed':
        return styles.claimedTag
      default:
        return styles.closedTag
    }
  }

  const handleMarkFound = (item: Item) => {
    Taro.showModal({
      title: '确认找回',
      content: `确定"${item.title}"已经找回了吗？`,
      success: (res) => {
        if (res.confirm) {
          updateItemStatus(item.id, 'claimed')
          Taro.showToast({
            title: '恭喜找回！',
            icon: 'success'
          })
        }
      }
    })
  }

  const handleOffline = (item: Item) => {
    Taro.showModal({
      title: '确认下架',
      content: `确定将"${item.title}"下架吗？`,
      success: (res) => {
        if (res.confirm) {
          updateItemStatus(item.id, 'closed')
          Taro.showToast({
            title: '已下架',
            icon: 'success'
          })
        }
      }
    })
  }

  const goToDetail = (id: string) => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${id}`
    })
  }

  const goToPublish = () => {
    Taro.switchTab({ url: '/pages/publish/index' })
  }

  const tabs = [
    { key: 'all', label: '全部' },
    { key: 'pending', label: '审核中' },
    { key: 'active', label: '展示中' },
    { key: 'closed', label: '已结束' }
  ]

  return (
    <View className={styles.page}>
      <View className={styles.filterTabs}>
        {tabs.map((tab) => (
          <View
            key={tab.key}
            className={classnames(styles.tabItem, activeTab === tab.key && styles.active)}
            onClick={() => setActiveTab(tab.key as any)}
          >
            {tab.label}
            {counts[tab.key as keyof typeof counts] > 0 && (
              <View className={styles.countBadge}>
                {counts[tab.key as keyof typeof counts]}
              </View>
            )}
          </View>
        ))}
      </View>

      {filteredItems.length > 0 ? (
        filteredItems.map((item) => (
          <View key={item.id} className={styles.itemCard}>
            <View className={styles.itemHeader}>
              <Image
                className={styles.itemImg}
                src={item.images[0]}
                mode='aspectFill'
                onClick={() => goToDetail(item.id)}
              />
              <View className={styles.itemInfo}>
                <View>
                  <View
                    className={classnames(
                      styles.typeTag,
                      item.type === 'lost' ? styles.lostTag : styles.foundTag
                    )}
                  >
                    {item.type === 'lost' ? '寻物' : '招领'}
                  </View>
                  <View className={classnames(styles.statusTag, getStatusClass(item.status))}>
                    {getStatusText(item.status)}
                  </View>
                </View>
                <View className={styles.itemTitle}>{item.title}</View>
                <View className={styles.itemDesc}>{item.description}</View>
                <View className={styles.itemMeta}>
                  <Text>📂 {categoryMap[item.category]}</Text>
                  <Text>📍 {item.location}</Text>
                </View>
              </View>
            </View>
            <View className={styles.itemStats}>
              <Text>👁 浏览 {item.viewCount}</Text>
              <Text>💬 留言 {item.messageCount}</Text>
              <Text>🕐 {formatTime(item.createdAt)}</Text>
            </View>
            {item.status === 'active' && (
              <View className={styles.actionBtns}>
                <View
                  className={`${styles.btn} ${styles.offlineBtn}`}
                  onClick={() => handleOffline(item)}
                >
                  下架
                </View>
                <View
                  className={`${styles.btn} ${styles.markFoundBtn}`}
                  onClick={() => handleMarkFound(item)}
                >
                  {item.type === 'lost' ? '标记已找回' : '标记已归还'}
                </View>
              </View>
            )}
          </View>
        ))
      ) : (
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>📝</Text>
          <Text className={styles.emptyText}>暂无发布记录</Text>
          <View className={styles.emptyBtn} onClick={goToPublish}>
            去发布一条
          </View>
        </View>
      )}
    </View>
  )
}

export default MyPublishPage
