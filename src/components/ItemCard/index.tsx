import React from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import type { Item } from '@/types'
import { formatTime } from '@/utils/index'
import classnames from 'classnames'

interface ItemCardProps {
  item: Item
  onClick?: () => void
  showStatus?: boolean
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onClick, showStatus = true }) => {
  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      Taro.navigateTo({
        url: `/pages/detail/index?id=${item.id}`
      })
    }
  }

  const getStatusBadge = () => {
    switch (item.status) {
      case 'pending':
        return <View className={classnames(styles.statusTag, styles.pendingStatus)}>⏳ 审核中</View>
      case 'active':
        return null
      case 'claimed':
        return <View className={classnames(styles.statusTag, styles.claimedStatus)}>✓ 已认领</View>
      case 'closed':
        return <View className={classnames(styles.statusTag, styles.closedStatus)}>✕ 已关闭</View>
      case 'expired':
        return <View className={classnames(styles.statusTag, styles.closedStatus)}>⏰ 已过期</View>
      default:
        return null
    }
  }

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.imageWrapper}>
        <Image
          className={styles.image}
          src={item.images[0]}
          mode='aspectFill'
          lazyLoad
        />
        <View className={classnames(styles.typeTag, item.type === 'lost' ? styles.lostTag : styles.foundTag)}>
          {item.type === 'lost' ? '寻物' : '招领'}
        </View>
        {showStatus && getStatusBadge()}
      </View>
      <View className={styles.content}>
        <View>
          <View className={styles.title}>{item.title}</View>
          <View className={styles.desc}>{item.description}</View>
        </View>
        <View className={styles.infoRow}>
          <View className={styles.infoItem}>
            <Text className={styles.icon}>📍</Text>
            <Text>{item.location}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.icon}>🕐</Text>
            <Text>{formatTime(item.createdAt)}</Text>
          </View>
        </View>
        <View className={styles.bottomRow}>
          <View className={styles.publisher}>
            <Image className={styles.avatar} src={item.publisherAvatar} mode='aspectFill' />
            <Text className={styles.name}>{item.publisher}</Text>
          </View>
          <View className={styles.meta}>
            {item.isHot && (
              <View className={styles.hotBadge}>🔥 热门</View>
            )}
            <Text>💬 {item.messageCount}</Text>
            <Text>👁 {item.viewCount}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default ItemCard
