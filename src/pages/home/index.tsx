import React, { useState, useMemo, useCallback } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import ItemCard from '@/components/ItemCard'
import { useAppStore } from '@/store'
import { hotLocations } from '@/data/common'
import type { Item } from '@/types'

const HomePage: React.FC = () => {
  const items = useAppStore((state) => state.items)
  const [refreshing, setRefreshing] = useState(false)

  const foundItems = useMemo(() => {
    return items
      .filter((item) => item.type === 'found' && item.status !== 'closed' && item.status !== 'expired')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3)
  }, [items])

  const lostItems = useMemo(() => {
    return items
      .filter((item) => item.type === 'lost' && item.status !== 'closed' && item.status !== 'expired')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3)
  }, [items])

  const handleRefresh = useCallback(() => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
      Taro.stopPullDownRefresh()
      Taro.showToast({ title: '刷新成功', icon: 'success', duration: 1000 })
    }, 800)
  }, [])

  const goToPublish = () => {
    Taro.switchTab({ url: '/pages/publish/index' })
  }

  const goToSearch = () => {
    Taro.switchTab({ url: '/pages/search/index' })
  }

  const goToNotice = () => {
    Taro.navigateTo({ url: '/pages/notice/index' })
  }

  const goToLocationSearch = () => {
    Taro.switchTab({ url: '/pages/search/index' })
  }

  return (
    <ScrollView
      className={styles.page}
      scrollY
      refresherEnabled
      refresherTriggered={refreshing}
      onRefresherRefresh={handleRefresh}
    >
      <View className={styles.banner}>
        <View className={styles.bannerContent}>
          <View className={styles.greeting}>👋 欢迎回家</View>
          <View className={styles.title}>邻里互助，失物可寻</View>
          <View className={styles.subtitle}>快速登记，高效找回，共建和谐小区</View>
          <View className={styles.quickPublish}>
            <View
              className={`${styles.quickBtn} ${styles.lostBtn}`}
              onClick={goToPublish}
            >
              🔍 我丢了东西
            </View>
            <View
              className={`${styles.quickBtn} ${styles.foundBtn}`}
              onClick={goToPublish}
            >
              🎁 我捡到东西
            </View>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.categories}>
          <View className={styles.categoryItem} onClick={goToSearch}>
            <View className={`${styles.categoryIcon} ${styles.lostIcon}`}>🔍</View>
            <Text className={styles.categoryText}>寻物启事</Text>
          </View>
          <View className={styles.categoryItem} onClick={goToSearch}>
            <View className={`${styles.categoryIcon} ${styles.foundIcon}`}>🎁</View>
            <Text className={styles.categoryText}>失物招领</Text>
          </View>
          <View className={styles.categoryItem} onClick={goToNotice}>
            <View className={`${styles.categoryIcon} ${styles.noticeIcon}`}>📢</View>
            <Text className={styles.categoryText}>公告栏</Text>
          </View>
          <View className={styles.categoryItem} onClick={goToSearch}>
            <View className={`${styles.categoryIcon} ${styles.hotIcon}`}>🔥</View>
            <Text className={styles.categoryText}>热门</Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <View className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>🎁</Text>
            <Text>最近捡到</Text>
          </View>
          <View className={styles.moreLink} onClick={goToSearch}>
            查看更多 <Text>›</Text>
          </View>
        </View>
        <View>
          {foundItems.length > 0 ? (
            foundItems.map((item) => <ItemCard key={item.id} item={item} />)
          ) : (
            <View style={{ textAlign: 'center', padding: '40rpx 0', color: '#86909C', fontSize: '28rpx' }}>
              暂无失物招领信息
            </View>
          )}
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <View className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>🔍</Text>
            <Text>最近丢失</Text>
          </View>
          <View className={styles.moreLink} onClick={goToSearch}>
            查看更多 <Text>›</Text>
          </View>
        </View>
        <View>
          {lostItems.length > 0 ? (
            lostItems.map((item) => <ItemCard key={item.id} item={item} />)
          ) : (
            <View style={{ textAlign: 'center', padding: '40rpx 0', color: '#86909C', fontSize: '28rpx' }}>
              暂无寻物启事信息
            </View>
          )}
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <View className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>📍</Text>
            <Text>热门地点</Text>
          </View>
        </View>
        <View className={styles.hotLocations}>
          {hotLocations.map((loc) => (
            <View
              key={loc.name}
              className={styles.locationCard}
              onClick={goToLocationSearch}
            >
              <View className={styles.locationIcon}>{loc.icon}</View>
              <View className={styles.locationName}>{loc.name}</View>
              <View className={styles.locationCount}>{loc.count}条记录</View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  )
}

export default HomePage
