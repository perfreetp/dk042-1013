import React, { useState, useEffect } from 'react'
import { View, Text, Image, Input, Swiper, SwiperItem } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import styles from './index.module.scss'
import classnames from 'classnames'
import { getItemById, getSimilarItems } from '@/data/items'
import { mockComments } from '@/data/common'
import type { Item, Comment } from '@/types'
import { categoryMap } from '@/types'
import { formatTime } from '@/utils/index'

const DetailPage: React.FC = () => {
  const router = useRouter()
  const itemId = router.params.id || '1'
  const [item, setItem] = useState<Item | undefined>()
  const [similarItems, setSimilarItems] = useState<Item[]>([])
  const [comments, setComments] = useState<Comment[]>(mockComments)
  const [commentText, setCommentText] = useState('')

  useEffect(() => {
    const data = getItemById(itemId)
    if (data) {
      setItem(data)
      setSimilarItems(getSimilarItems(itemId, 4))
    }
  }, [itemId])

  const handleSendComment = () => {
    if (!commentText.trim()) {
      Taro.showToast({ title: '请输入内容', icon: 'none' })
      return
    }

    const newComment: Comment = {
      id: `c${Date.now()}`,
      userId: 'me',
      userName: '我',
      userAvatar: 'https://picsum.photos/id/64/100/100',
      content: commentText.trim(),
      time: '刚刚'
    }

    setComments([...comments, newComment])
    setCommentText('')
    Taro.showToast({ title: '发布成功', icon: 'success' })
  }

  const handleClaim = () => {
    Taro.navigateTo({
      url: `/pages/claim/index?id=${itemId}`
    })
  }

  const handleContact = () => {
    if (item?.contact) {
      Taro.showActionSheet({
        itemList: ['拨打电话', '复制联系方式'],
        success: (res) => {
          if (res.tapIndex === 0) {
            Taro.makePhoneCall({
              phoneNumber: '13800000000'
            }).catch(() => {
              Taro.showToast({ title: '拨号失败', icon: 'none' })
            })
          } else {
            Taro.setClipboardData({
              data: item.contact,
              success: () => {
                Taro.showToast({ title: '已复制', icon: 'success' })
              }
            })
          }
        }
      })
    }
  }

  const handleReport = () => {
    Taro.navigateTo({
      url: `/pages/report/index?itemId=${itemId}`
    })
  }

  const goToDetail = (id: string) => {
    Taro.redirectTo({
      url: `/pages/detail/index?id=${id}`
    })
  }

  if (!item) {
    return (
      <View className={styles.page}>
        <View style={{ textAlign: 'center', padding: '100rpx 0', color: '#86909C' }}>
          加载中...
        </View>
      </View>
    )
  }

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
                />
              </SwiperItem>
            ))}
          </Swiper>
          <View className={classnames(styles.typeBadge, item.type === 'lost' ? styles.lostBadge : styles.foundBadge)}>
            {item.type === 'lost' ? '🔍 寻物启事' : '🎁 失物招领'}
          </View>
          {item.status === 'claimed' && (
            <View className={styles.statusBadge}>✓ 已认领</View>
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
              <View className={styles.infoValue}>{comments.length}条</View>
            </View>
          </View>
        </View>

        <View className={styles.verifyTip}>
          ⚠️ 温馨提示：认领物品时请务必核实身份，提供物品独有特征，避免冒领。请在物业或公共场合进行交接。
        </View>

        <View className={styles.section}>
          <View className={styles.sectionTitle}>
            <Text>💬</Text>
            <Text>线索留言 ({comments.length})</Text>
          </View>
          <View className={styles.commentList}>
            {comments.map(comment => (
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
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionTitle}>
            <Text>🔗</Text>
            <Text>相似物品</Text>
          </View>
          <ScrollView scrollX className={styles.similarList}>
            {similarItems.map(similar => (
              <View
                key={similar.id}
                className={styles.similarCard}
                onClick={() => goToDetail(similar.id)}
              >
                <Image
                  className={styles.similarImg}
                  src={similar.images[0]}
                  mode='aspectFill'
                />
                <View className={styles.similarInfo}>
                  <View className={styles.similarTitle}>{similar.title}</View>
                  <View className={styles.similarMeta}>{similar.location}</View>
                </View>
              </View>
            ))}
          </ScrollView>
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
