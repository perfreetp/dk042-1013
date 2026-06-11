import React, { useState } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import classnames from 'classnames'
import { useAppStore } from '@/store'
import type { Item } from '@/types'
import { formatTime } from '@/utils/index'
import { categoryMap } from '@/types'

const ReviewPage: React.FC = () => {
  const items = useAppStore((state) => state.items)
  const updateItemStatus = useAppStore((state) => state.updateItemStatus)
  const [pendingItems, setPendingItems] = useState<Item[]>(
    items.filter((item) => item.status === 'pending')
  )

  React.useEffect(() => {
    setPendingItems(items.filter((item) => item.status === 'pending'))
  }, [items])

  const handleApprove = (item: Item) => {
    Taro.showModal({
      title: '审核通过',
      content: `确定通过"${item.title}"的审核吗？`,
      success: (res) => {
        if (res.confirm) {
          updateItemStatus(item.id, 'active')
          Taro.showToast({
            title: '已通过',
            icon: 'success'
          })
        }
      }
    })
  }

  const handleReject = (item: Item) => {
    Taro.showActionSheet({
      itemList: ['信息不完整', '内容违规', '物品信息不符', '其他原因'],
      success: (res) => {
        updateItemStatus(item.id, 'closed')
        Taro.showToast({
          title: '已驳回',
          icon: 'success'
        })
      }
    })
  }

  const goToDetail = (id: string) => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${id}`
    })
  }

  return (
    <View className={styles.page}>
      {pendingItems.length > 0 ? (
        pendingItems.map((item) => (
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
                  <View className={styles.pendingBadge}>待审核</View>
                </View>
                <View className={styles.itemTitle}>{item.title}</View>
                <View className={styles.itemDesc}>{item.description}</View>
                <View className={styles.itemMeta}>
                  <Text>📂 {categoryMap[item.category]}</Text>
                  <Text>📍 {item.location}</Text>
                  <Text>🎨 {item.color || '未填写'}</Text>
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
                className={`${styles.btn} ${styles.rejectBtn}`}
                onClick={() => handleReject(item)}
              >
                驳回
              </View>
              <View
                className={`${styles.btn} ${styles.approveBtn}`}
                onClick={() => handleApprove(item)}
              >
                通过
              </View>
            </View>
          </View>
        ))
      ) : (
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>✅</Text>
          <Text className={styles.emptyText}>暂无待审核内容</Text>
        </View>
      )}
    </View>
  )
}

export default ReviewPage
