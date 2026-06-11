import React, { useState, useMemo } from 'react'
import { View, Text, Textarea, Input } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import styles from './index.module.scss'
import classnames from 'classnames'
import { useAppStore } from '@/store'

const reportReasons = [
  { id: 'fake', label: '虚假信息，物品不存在' },
  { id: 'stolen', label: '可能是赃物，来源不明' },
  { id: 'offensive', label: '含有违规或不当内容' },
  { id: 'scam', label: '疑似诈骗或钓鱼' },
  { id: 'duplicate', label: '重复发布' },
  { id: 'other', label: '其他原因' }
]

const ReportPage: React.FC = () => {
  const router = useRouter()
  const itemId = router.params.itemId || ''

  const items = useAppStore((state) => state.items)
  const currentUser = useAppStore((state) => state.currentUser)
  const addReport = useAppStore((state) => state.addReport)

  const item = useMemo(() => {
    return items.find((i) => i.id === itemId)
  }, [items, itemId])

  const [selectedReason, setSelectedReason] = useState('')
  const [description, setDescription] = useState('')
  const [contact, setContact] = useState('')

  const canSubmit = selectedReason && description.trim()

  const handleSubmit = () => {
    if (!canSubmit) {
      Taro.showToast({
        title: '请填写完整信息',
        icon: 'none'
      })
      return
    }

    Taro.showModal({
      title: '提交举报',
      content: '请确保举报内容真实有效，恶意举报将被记入信用档案。',
      confirmText: '确认举报',
      confirmColor: '#F53F3F',
      success: (res) => {
        if (res.confirm) {
          addReport({
            itemId: itemId,
            itemTitle: item?.title || '未知物品',
            reason: selectedReason,
            description: description.trim(),
            reporter: currentUser.name,
            reporterPhone: contact || currentUser.phone
          })

          Taro.showToast({
            title: '举报已提交',
            icon: 'success',
            duration: 2000
          })
          setTimeout(() => {
            Taro.navigateBack()
          }, 1500)
        }
      }
    })
  }

  return (
    <View className={styles.page}>
      <View className={styles.tipCard}>
        <View className={styles.tipTitle}>
          <Text>🚨</Text>
          <Text>举报须知</Text>
        </View>
        <View className={styles.tipContent}>
          <View>• 请如实填写举报信息，恶意举报将承担相应责任</View>
          <View>• 物业将在24小时内审核处理您的举报</View>
          <View>• 举报内容和举报人信息将严格保密</View>
          <View>• 如情况紧急，请直接联系物业或报警</View>
        </View>
      </View>

      {item && (
        <View className={styles.formCard}>
          <View className={styles.formTitle}>
            <Text>📦</Text>
            <Text>举报物品</Text>
          </View>
          <View className={styles.itemInfo}>
            <Text className={styles.itemTitle}>{item.title}</Text>
            <Text className={styles.itemMeta}>📍 {item.location} | 🕐 {item.time}</Text>
          </View>
        </View>
      )}

      <View className={styles.formCard}>
        <View className={styles.formTitle}>
          <Text>📋</Text>
          <Text>举报原因</Text>
        </View>

        <View className={styles.reasonList}>
          {reportReasons.map((reason) => (
            <View
              key={reason.id}
              className={classnames(
                styles.reasonItem,
                selectedReason === reason.id && styles.active
              )}
              onClick={() => setSelectedReason(reason.id)}
            >
              <View className={styles.radio} />
              <Text className={styles.reasonText}>{reason.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.formCard}>
        <View className={styles.formTitle}>
          <Text>📝</Text>
          <Text>详细说明</Text>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>
            <Text className={styles.required}>*</Text>问题描述
          </Text>
          <Textarea
            className={styles.textarea}
            placeholder='请详细描述您举报的问题，提供相关证据和说明...'
            value={description}
            onInput={(e) => setDescription(e.detail.value)}
            maxlength={500}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>上传证据（可选）</Text>
          <View className={styles.uploadArea}>
            <View className={styles.uploadBtn}>
              <Text className={styles.plusIcon}>+</Text>
              <Text>添加图片</Text>
            </View>
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>您的联系方式（可选）</Text>
          <Input
            className={styles.input}
            type='number'
            placeholder='方便物业联系您核实情况'
            value={contact}
            onInput={(e) => setContact(e.detail.value)}
            maxlength={11}
          />
        </View>
      </View>

      <View className={styles.submitBar}>
        <View
          className={classnames(styles.submitBtn, !canSubmit && styles.disabled)}
          onClick={handleSubmit}
        >
          提交举报
        </View>
      </View>
    </View>
  )
}

export default ReportPage
