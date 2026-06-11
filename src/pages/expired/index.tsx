import React, { useState, useMemo } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import classnames from 'classnames'
import { useAppStore } from '@/store'
import type { Item } from '@/types'
import { formatTime, formatDate } from '@/utils/index'
import { categoryMap } from '@/types'

const ExpiredPage: React.FC = () => {
  const items = useAppStore((state) => state.items)
  const updateItemStatus = useAppStore((state) => state.updateItemStatus)
  const [activeTab, setActiveTab] = useState<'expired' | 'all'>('expired')

  const filteredItems = useMemo(() => {
    if (activeTab === 'all') {
      return items.filter((item) => item.status === 'active')
    }
    const now = Date.now()
    return items.filter((item) => {
      if (item.status !== 'active') return false
      const created = new Date(item.createdAt).getTime()
      const days = (now - created) / (1000 * 60 * 60 * 24)
      return days >= 10
    })
  }, [items, activeTab])

  const getExpiredDays = (createdAt: string) => {
    const created = new Date(createdAt).getTime()
    const now = Date.now()
    const days = Math.floor((now - created) / (1000 * 60 * 60 * 24))
    return days
  }

  const handleOffline = (item: Item) => {
    Taro.showModal({
      title: '确认下架',
      content: `确定将"${item.title}"下架吗？`,
      success: (res) => {
        if (res.confirm) {
          updateItemStatus(item.id, 'expired')
          Taro.showToast({
            title: '已下架',
            icon: 'success'
          })
        }
      }
    })
  }

  const handleExtend = (item: Item) => {
    Taro.showModal({
      title: '延长展示',
      content: `确定将"${item.title}"延长展示7天吗？`,
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({
            title: '已延长',
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
      case 'active':
        return styles.activeTag
      case 'expired':
        return styles.expiredTag
      default:
        return styles.closedTag
    }
  }

  return (
    <View className={styles.page}>
      <View className={styles.filterTabs}>
        <View
          className={classnames(styles.tabItem, activeTab === 'expired' && styles.active)}
          onClick={() => setActiveTab('expired')}
        >
          即将过期
          <View className={styles.countBadge}>{filteredItems.length}</View>
        </View>
        <View
          className={classnames(styles.tabItem, activeTab === 'all' && styles.active)}
          onClick={() => setActiveTab('all')}
        >
          全部展示中
        </View>
      </View>

      {filteredItems.length > 0 ? (
        filteredItems.map((item) => {
          const expiredDays = getExpiredDays(item.createdAt)
          return (
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
                    {expiredDays >= 10 && (
                      <View className={classnames(styles.statusTag, styles.expiredTag)}>
                        {expiredDays >= 14 ? '已过期' : `即将过期（${14 - expiredDays}天后）`}
                      </View>
                    )}
                  </View>
                  <View className={styles.itemTitle}>{item.title}</View>
                  <View className={styles.itemDesc}>{item.description}</View>
                  <View className={styles.itemMeta}>
                    <Text>📂 {categoryMap[item.category]}</Text>
                    <Text>📍 {item.location}</Text>
                    <Text>📅 发布于 {formatDate(item.createdAt)}</Text>
                    <Text>⏱ 已展示 {expiredDays} 天</Text>
                  </View>
                </View>
              </View>
              <View className={styles.publisher}>
                <Image
                  className={styles.avatar}
                  src={item.publisherAvatar}
                  mode='aspectFill'
                />
                <Text className={styles.publisherName}>{item.publisher}</Text>
                <Text className={styles.publishTime}>
                  {formatTime(item.createdAt)}
                </Text>
              </View>
              <View className={styles.actionBtns}>
                <View
                  className={`${styles.btn} ${styles.extendBtn}`}
                  onClick={() => handleExtend(item)}
                >
                  延长7天
                </View>
                <View
                  className={`${styles.btn} ${styles.offlineBtn}`}
                  onClick={() => handleOffline(item)}
                >
                  立即下架
                </View>
              </View>
            </View>
          )
        })
      ) : (
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>📋</Text>
          <Text className={styles.emptyText}>
            {activeTab === 'expired' ? '暂无即将过期的物品' : '暂无展示中的物品'}
          </Text>
        </View>
      )}
    </View>
  )
}

export default ExpiredPage
