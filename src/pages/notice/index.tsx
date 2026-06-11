import React, { useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import classnames from 'classnames'
import { mockNotices } from '@/data/notices'
import type { Notice } from '@/types'

const NoticePage: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>(mockNotices)

  const handleNoticeClick = (notice: Notice) => {
    Taro.showModal({
      title: notice.title,
      content: notice.content,
      showCancel: false,
      confirmText: '我知道了'
    })
  }

  return (
    <ScrollView scrollY className={styles.page}>
      {notices.length > 0 ? (
        notices.map(notice => (
          <View
            key={notice.id}
            className={classnames(styles.noticeCard, notice.isTop && styles.isTop)}
            onClick={() => handleNoticeClick(notice)}
          >
            {notice.isTop && <View className={styles.topBadge}>置顶</View>}
            <View className={styles.noticeHeader}>
              <View className={styles.noticeTitle}>{notice.title}</View>
            </View>
            <View className={styles.noticeMeta}>
              <View className={styles.publisher}>
                <Text>🏢</Text>
                <Text>{notice.publisher}</Text>
              </View>
              <View>📅 {notice.createdAt}</View>
            </View>
            <View className={styles.noticeContent}>{notice.content}</View>
            <View className={styles.noticeFooter}>
              <View className={styles.readMore}>查看详情 ›</View>
            </View>
          </View>
        ))
      ) : (
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>📋</Text>
          <Text className={styles.emptyText}>暂无公告</Text>
        </View>
      )}
    </ScrollView>
  )
}

export default NoticePage
