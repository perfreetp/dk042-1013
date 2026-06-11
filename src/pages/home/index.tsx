import React, { useState, useCallback } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import ItemCard from '@/components/ItemCard'
import { mockItems, getFoundItems, getLostItems } from '@/data/items'
import { hotLocations } from '@/data/common'
import type { Item } from '@/types'

const HomePage: React.FC = () => {
  const [foundItems, setFoundItems] = useState<Item[]>(getFoundItems().slice(0, 3))
  const [lostItems, setLostItems] = useState<Item[]>(getLostItems().slice(0, 3))
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = useCallback(() => {
    setRefreshing(true)
    setTimeout(() => {
      setFoundItems(getFoundItems().slice(0, 3))
      setLostItems(getLostItems().slice(0, 3))
      setRefreshing(false)
      Taro.stopPullDownRefresh()
    }, 800)
  }, [])

  const goToPublish = (type: 'lost' | 'found') => {
    Taro.switchTab({ url: '/pages/publish/index' })
  }

  const goToSearch = (type?: string) => {
    Taro.switchTab({ url: '/pages/search/index' })
  }

  const goToNotice = () => {
    Taro.navigateTo({ url: '/pages/notice/index' })
  }

  const goToLocationSearch = (location: string) => {
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
              onClick={() => goToPublish('lost')}
            >
              🔍 我丢了东西
            </View>
            <View
              className={`${styles.quickBtn} ${styles.foundBtn}`}
              onClick={() => goToPublish('found')}
            >
              🎁 我捡到东西
            </View>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.categories}>
          <View className={styles.categoryItem} onClick={() => goToSearch('lost')}>
            <View className={`${styles.categoryIcon} ${styles.lostIcon}`}>🔍</View>
            <Text className={styles.categoryText}>寻物启事</Text>
          </View>
          <View className={styles.categoryItem} onClick={() => goToSearch('found')}>
            <View className={`${styles.categoryIcon} ${styles.foundIcon}`}>🎁</View>
            <Text className={styles.categoryText}>失物招领</Text>
          </View>
          <View className={styles.categoryItem} onClick={goToNotice}>
            <View className={`${styles.categoryIcon} ${styles.noticeIcon}`}>📢</View>
            <Text className={styles.categoryText}>公告栏</Text>
          </View>
          <View className={styles.categoryItem} onClick={() => goToSearch('hot')}>
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
          <View className={styles.moreLink} onClick={() => goToSearch('found')}>
            查看更多 <Text>›</Text>
          </View>
        </View>
        <View>
          {foundItems.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <View className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>🔍</Text>
            <Text>最近丢失</Text>
          </View>
          <View className={styles.moreLink} onClick={() => goToSearch('lost')}>
            查看更多 <Text>›</Text>
          </View>
        </View>
        <View>
          {lostItems.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
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
          {hotLocations.map(loc => (
            <View
              key={loc.name}
              className={styles.locationCard}
              onClick={() => goToLocationSearch(loc.name)}
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
