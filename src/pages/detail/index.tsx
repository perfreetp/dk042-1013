import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { View, Text, Image, Input, Swiper, SwiperItem, ScrollView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import styles from './index.module.scss'
import classnames from 'classnames'
import { useAppStore } from '@/store'
import type { Item, Comment } from '@/types'
import { categoryMap } from '@/types'
import { formatTime } from '@/utils/index'

const DetailPage: React.FC = () => {
  const router = useRouter()
  const itemId = router.params.id || '1'
  
  const items = useAppStore((state) => state.items)
  const currentUser = useAppStore((state) => state.currentUser)
  const incrementViewCount = useAppStore((state) => state.incrementViewCount)
  const addComment = useAppStore((state) => state.addComment)
  const addReport = useAppStore((state) => state.addReport)

  const [item, setItem] = useState<Item | undefined>()
  const [commentText, setCommentText] = useState('')
  const [loaded, setLoaded] = useState(false)

  const similarItems = useMemo(() => {
    if (!item) return []
    return items
      .filter((i) => 
        i.id !== item.id && 
        i.category === item.category && 
        i.type === item.type &&
        i.status !== 'closed' &&
        i.status !== 'expired'
      )
      .slice(0, 4)
  }, [item, items])

  const initData = useCallback(() => {
    const foundItem = items.find((i) => i.id === itemId)
    if (foundItem) {
      setItem(foundItem)
      incrementViewCount(itemId)
    }
    setLoaded(true)
  }, [items, itemId, incrementViewCount])

  useEffect(() => {
    initData()
  }, [initData])

  const handleSendComment = useCallback(() => {
    if (!commentText.trim()) {
      Taro.showToast({ title: '请输入内容', icon: 'none' })
      return
    }

    if (!item) return

    const newComment: Comment = {
      id: `c${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content: commentText.trim(),
      time: '刚刚',
      isClue: false
    }

    addComment(itemId, newComment)
    setCommentText('')
    
    const updatedItem = items.find((i) => i.id === itemId)
    if (updatedItem) {
      setItem(updatedItem)
    }
    
    Taro.showToast({ title: '发布成功', icon: 'success' })
  }, [commentText, item, currentUser, addComment, itemId, items])

  const handleClaim = () => {
    if (!item) return
    Taro.navigateTo({
      url: `/pages/claim/index?id=${itemId}`
    })
  }

  const handleContact = () => {
    if (!item?.contact) return
    
    Taro.showActionSheet({
      itemList: ['拨打电话', '复制联系方式'],
      success: (res) => {
        if (res.tapIndex === 0) {
          Taro.makePhoneCall({
            phoneNumber: item.contact || ''
          }).catch(() => {
            Taro.showToast({ title: '拨号失败', icon: 'none' })
          })
        } else {
          Taro.setClipboardData({
            data: item.contact || '',
            success: () => {
              Taro.showToast({ title: '已复制', icon: 'success' })
            }
          })
        }
      }
    })
  }

  const handleReport = () => {
    if (!item) return
    
    Taro.showActionSheet({
      itemList: ['虚假信息', '疑似赃物', '违规内容', '疑似诈骗', '重复发布', '其他原因'],
      success: (res) => {
        const reasons = ['fake', 'stolen', 'offensive', 'scam', 'duplicate', 'other']
        const reason = reasons[res.tapIndex]
        
        Taro.showModal({
          title: '举报确认',
          content: '确定要提交此举报吗？请确保信息真实有效。',
          success: (modalRes) => {
            if (modalRes.confirm) {
              addReport({
                itemId: item.id,
                itemTitle: item.title,
                reason,
                description: `用户举报：${item.title}`,
                reporter: currentUser.name,
                reporterPhone: currentUser.phone
              })
              Taro.showToast({
                title: '举报成功，感谢您的反馈',
                icon: 'success',
                duration: 2000
              })
            }
          }
        })
      }
    })
  }

  const goToDetail = (id: string) => {
    Taro.redirectTo({
      url: `/pages/detail/index?id=${id}`
    })
  }

  if (!loaded) {
    return (
      <View className={styles.page}>
        <View style={{ textAlign: 'center', padding: '100rpx 0', color: '#86909C' }}>
          加载中...
        </View>
      </View>
    )
  }

  if (!item) {
    return (
      <View className={styles.page}>
        <View style={{ textAlign: 'center', padding: '100rpx 0', color: '#86909C' }}>
          物品不存在或已被删除
        </View>
      </View>
    )
  }

  const statusBadgeText = (() => {
    switch (item.status) {
      case 'pending':
        return '⏳ 审核中'
      case 'active':
        return ''
      case 'claimed':
        return '✓ 已认领'
      case 'closed':
        return '✕ 已关闭'
      case 'expired':
        return '⏰ 已过期'
      default:
        return ''
    }
  })()

  return (
    <View className={styles.page}>
      <View style={{ paddingBottom: '380rpx' }}>
        <View className={styles.imageSwiper}>
          <Swiper
            className={styles.swiperImage}
            indicatorDots
            autoplay={false}
            circular
          >
            {item.images.map((img, index) => (
              <SwiperItem key={index}>
                <Image
                  className={styles.swiperImage}
                  src={img}
                  mode='aspectFill'
                  lazyLoad
                />
              </SwiperItem>
            ))}
          </Swiper>
          <View className={classnames(styles.typeBadge, item.type === 'lost' ? styles.lostBadge : styles.foundBadge)}>
            {item.type === 'lost' ? '🔍 寻物启事' : '🎁 失物招领'}
          </View>
          {statusBadgeText && (
            <View className={styles.statusBadge}>{statusBadgeText}</View>
          )}
        </View>

        <View className={styles.infoCard}>
          <View className={styles.title}>{item.title}</View>
          <View className={styles.metaRow}>
            <View className={styles.metaItem}>
              <Text className={styles.icon}>📂</Text>
              <Text>{categoryMap[item.category]}</Text>
            </View>
            <View className={styles.metaItem}>
              <Text className={styles.icon}>📍</Text>
              <Text>{item.location}</Text>
            </View>
            <View className={styles.metaItem}>
              <Text className={styles.icon}>🏢</Text>
              <Text>{item.building}</Text>
            </View>
            <View className={styles.metaItem}>
              <Text className={styles.icon}>🕐</Text>
              <Text>{item.time}</Text>
            </View>
          </View>

          <View className={styles.sectionTitle}>
            <Text>📝</Text>
            <Text>详细描述</Text>
          </View>
          <View className={styles.description}>{item.description}</View>

          <View className={styles.infoGrid}>
            <View className={styles.infoBox}>
              <View className={styles.infoLabel}>物品颜色</View>
              <View className={styles.infoValue}>{item.color || '未填写'}</View>
            </View>
            <View className={styles.infoBox}>
              <View className={styles.infoLabel}>发布时间</View>
              <View className={styles.infoValue}>{formatTime(item.createdAt)}</View>
            </View>
            <View className={styles.infoBox}>
              <View className={styles.infoLabel}>浏览次数</View>
              <View className={styles.infoValue}>{item.viewCount}次</View>
            </View>
            <View className={styles.infoBox}>
              <View className={styles.infoLabel}>留言数</View>
              <View className={styles.infoValue}>{item.comments?.length || 0}条</View>
            </View>
          </View>
        </View>

        <View className={styles.verifyTip}>
          ⚠️ 温馨提示：认领物品时请务必核实身份，提供物品独有特征，避免冒领。请在物业或公共场合进行交接。
        </View>

        <View className={styles.section}>
          <View className={styles.sectionTitle}>
            <Text>💬</Text>
            <Text>线索留言 ({item.comments?.length || 0})</Text>
          </View>
          <View className={styles.commentList}>
            {item.comments && item.comments.length > 0 ? (
              item.comments.map((comment) => (
                <View key={comment.id} className={styles.commentItem}>
                  <View className={styles.commentHeader}>
                    <Image
                      className={styles.commentAvatar}
                      src={comment.userAvatar}
                      mode='aspectFill'
                    />
                    <Text className={styles.commentName}>{comment.userName}</Text>
                    {comment.isClue && (
                      <View className={styles.clueTag}>有效线索</View>
                    )}
                    <Text className={styles.commentTime}>{comment.time}</Text>
                  </View>
                  <View className={styles.commentContent}>{comment.content}</View>
                </View>
              ))
            ) : (
              <View style={{ textAlign: 'center', padding: '60rpx 0', color: '#86909C', fontSize: '28rpx' }}>
                暂无留言，快来发表第一条线索吧！
              </View>
            )}
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionTitle}>
            <Text>🔗</Text>
            <Text>相似物品</Text>
          </View>
          {similarItems.length > 0 ? (
            <ScrollView scrollX className={styles.similarList}>
              {similarItems.map((similar) => (
                <View
                  key={similar.id}
                  className={styles.similarCard}
                  onClick={() => goToDetail(similar.id)}
                >
                  <Image
                    className={styles.similarImg}
                    src={similar.images[0]}
                    mode='aspectFill'
                    lazyLoad
                  />
                  <View className={styles.similarInfo}>
                    <View className={styles.similarTitle}>{similar.title}</View>
                    <View className={styles.similarMeta}>{similar.location}</View>
                  </View>
                </View>
              ))}
            </ScrollView>
          ) : (
            <View style={{ textAlign: 'center', padding: '40rpx 0', color: '#86909C', fontSize: '28rpx' }}>
              暂无相似物品
            </View>
          )}
        </View>
      </View>

      <View className={styles.commentInput}>
        <Input
          className={styles.commentField}
          placeholder='说点什么，提供线索...'
          value={commentText}
          onInput={(e) => setCommentText(e.detail.value)}
          confirmType='send'
          onConfirm={handleSendComment}
          maxlength={200}
        />
        <View className={styles.sendBtn} onClick={handleSendComment}>发送</View>
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.reportBtn} onClick={handleReport}>
          🚨
        </View>
        <View
          className={`${styles.actionBtn} ${styles.secondaryBtn}`}
          onClick={handleContact}
        >
          联系发布者
        </View>
        <View
          className={`${styles.actionBtn} ${styles.primaryBtn}`}
          onClick={handleClaim}
        >
          {item.type === 'lost' ? '我有线索' : '我要认领'}
        </View>
      </View>
    </View>
  )
}

export default DetailPage
