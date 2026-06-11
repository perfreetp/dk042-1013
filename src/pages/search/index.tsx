import React, { useState, useMemo } from 'react'
import { View, Text, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import classnames from 'classnames'
import ItemCard from '@/components/ItemCard'
import { mockItems } from '@/data/items'
import type { ItemType, ItemCategory } from '@/types'
import { categoryMap, categoryList } from '@/types'
import { hotLocations } from '@/data/common'

type TabType = 'all' | ItemType

const SearchPage: React.FC = () => {
  const [keyword, setKeyword] = useState('')
  const [activeTab, setActiveTab] = useState<TabType>('all')
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | ''>('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [sortBy, setSortBy] = useState<'time' | 'hot'>('time')

  const locationOptions = hotLocations.map(l => l.name)

  const filteredItems = useMemo(() => {
    let result = [...mockItems]

    if (activeTab !== 'all') {
      result = result.filter(item => item.type === activeTab)
    }

    if (selectedCategory) {
      result = result.filter(item => item.category === selectedCategory)
    }

    if (selectedLocation) {
      result = result.filter(item =>
        item.location.includes(selectedLocation) ||
        item.building.includes(selectedLocation)
      )
    }

    if (keyword.trim()) {
      const kw = keyword.trim().toLowerCase()
      result = result.filter(item =>
        item.title.toLowerCase().includes(kw) ||
        item.description.toLowerCase().includes(kw) ||
        item.color.toLowerCase().includes(kw)
      )
    }

    if (sortBy === 'time') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } else {
      result.sort((a, b) => b.viewCount - a.viewCount)
    }

    return result
  }, [keyword, activeTab, selectedCategory, selectedLocation, sortBy])

  const handleClear = () => {
    setKeyword('')
  }

  const goToPublish = () => {
    Taro.switchTab({ url: '/pages/publish/index' })
  }

  return (
    <View className={styles.page}>
      <View className={styles.searchBar}>
        <View className={styles.searchInput}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Input
            className={styles.searchInputField}
            placeholder='搜索物品名称、描述...'
            value={keyword}
            onInput={(e) => setKeyword(e.detail.value)}
            confirmType='search'
          />
          {keyword && (
            <View className={styles.clearBtn} onClick={handleClear}>×</View>
          )}
        </View>
      </View>

      <View className={styles.filterTabs}>
        <View
          className={classnames(styles.filterTab, activeTab === 'all' && styles.active)}
          onClick={() => setActiveTab('all')}
        >
          全部
        </View>
        <View
          className={classnames(styles.filterTab, activeTab === 'lost' && styles.active)}
          onClick={() => setActiveTab('lost')}
        >
          寻物
        </View>
        <View
          className={classnames(styles.filterTab, activeTab === 'found' && styles.active)}
          onClick={() => setActiveTab('found')}
        >
          招领
        </View>
      </View>

      <View className={styles.filterSection}>
        <View className={styles.filterRow}>
          <Text className={styles.filterLabel}>类别：</Text>
          <View className={styles.filterOptions}>
            <View
              className={classnames(styles.filterTag, !selectedCategory && styles.active)}
              onClick={() => setSelectedCategory('')}
            >
              全部
            </View>
            {categoryList.map(cat => (
              <View
                key={cat}
                className={classnames(styles.filterTag, selectedCategory === cat && styles.active)}
                onClick={() => setSelectedCategory(cat)}
              >
                {categoryMap[cat]}
              </View>
            ))}
          </View>
        </View>
        <View className={styles.filterRow}>
          <Text className={styles.filterLabel}>地点：</Text>
          <View className={styles.filterOptions}>
            <View
              className={classnames(styles.filterTag, !selectedLocation && styles.active)}
              onClick={() => setSelectedLocation('')}
            >
              全部
            </View>
            {locationOptions.map(loc => (
              <View
                key={loc}
                className={classnames(styles.filterTag, selectedLocation === loc && styles.active)}
                onClick={() => setSelectedLocation(loc)}
              >
                {loc}
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className={styles.results}>
        <View className={styles.resultHeader}>
          <Text className={styles.resultCount}>共找到 {filteredItems.length} 条结果</Text>
          <View className={styles.sortOptions}>
            <View
              className={classnames(styles.sortItem, sortBy === 'time' && styles.active)}
              onClick={() => setSortBy('time')}
            >
              最新发布
            </View>
            <View
              className={classnames(styles.sortItem, sortBy === 'hot' && styles.active)}
              onClick={() => setSortBy('hot')}
            >
              最多浏览
            </View>
          </View>
        </View>

        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <ItemCard key={item.id} item={item} />
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>🔍</Text>
            <Text className={styles.emptyText}>没有找到相关物品</Text>
            <View className={styles.emptyBtn} onClick={goToPublish}>
              去发布一条
            </View>
          </View>
        )}
      </View>
    </View>
  )
}

export default SearchPage
