import React, { useState, useEffect } from 'react'
import { View, Text, Input, Textarea, Image } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import styles from './index.module.scss'
import classnames from 'classnames'
import { getItemById } from '@/data/items'
import type { Item } from '@/types'

const ClaimPage: React.FC = () => {
  const router = useRouter()
  const itemId = router.params.id || '1'
  const [item, setItem] = useState<Item | undefined>()
  const [claimantName, setClaimantName] = useState('')
  const [claimantPhone, setClaimantPhone] = useState('')
  const [building, setBuilding] = useState('')
  const [description, setDescription] = useState('')
  const [idCardLast, setIdCardLast] = useState('')
  const [images, setImages] = useState<string[]>([])

  useEffect(() => {
    const data = getItemById(itemId)
    if (data) {
      setItem(data)
    }
  }, [itemId])

  const canSubmit = claimantName && claimantPhone && description

  const handleSubmit = () => {
    if (!canSubmit) {
      Taro.showToast({
        title: '请填写完整信息',
        icon: 'none'
      })
      return
    }

    Taro.showModal({
      title: '提交确认',
      content: '请确保您提供的信息真实有效，虚假认领将被记入信用档案。',
      confirmText: '确认提交',
      success: (res) => {
        if (res.confirm) {
          Taro.showLoading({ title: '提交中...' })
          setTimeout(() => {
            Taro.hideLoading()
            Taro.showToast({
              title: '申请已提交',
              icon: 'success',
              duration: 2000
            })
            setTimeout(() => {
              Taro.navigateBack()
            }, 1500)
          }, 1000)
        }
      }
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
      <View className={styles.itemInfo}>
        <Image className={styles.itemImg} src={item.images[0]} mode='aspectFill' />
        <View className={styles.itemDetail}>
          <View className={styles.itemTitle}>{item.title}</View>
          <View className={styles.itemMeta}>📍 {item.location}</View>
          <View className={styles.itemMeta}>🕐 {item.time}</View>
        </View>
      </View>

      <View className={styles.verifyTip}>
        <View className={styles.tipTitle}>🔐 身份核验提示</View>
        <View>• 请如实填写您的身份信息和物品特征</View>
        <View>• 物业工作人员将核实您的身份</View>
        <View>• 认领时请携带有效身份证件</View>
        <View>• 虚假认领将被记入小区信用档案</View>
      </View>

      <View className={styles.formCard}>
        <View className={styles.formTitle}>📋 认领人信息</View>

        <View className={styles.formItem}>
          <Text className={styles.label}>
            <Text className={styles.required}>*</Text>姓名
          </Text>
          <Input
            className={styles.input}
            placeholder='请输入您的真实姓名'
            value={claimantName}
            onInput={(e) => setClaimantName(e.detail.value)}
            maxlength={20}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>
            <Text className={styles.required}>*</Text>联系电话
          </Text>
          <Input
            className={styles.input}
            type='number'
            placeholder='请输入您的联系电话'
            value={claimantPhone}
            onInput={(e) => setClaimantPhone(e.detail.value)}
            maxlength={11}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>楼栋房号</Text>
          <Input
            className={styles.input}
            placeholder='如：3号楼2单元1502室'
            value={building}
            onInput={(e) => setBuilding(e.detail.value)}
            maxlength={30}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>身份证号后6位</Text>
          <Input
            className={styles.input}
            type='number'
            placeholder='用于身份核验，不会公开显示'
            value={idCardLast}
            onInput={(e) => setIdCardLast(e.detail.value)}
            maxlength={6}
          />
        </View>
      </View>

      <View className={styles.formCard}>
        <View className={styles.formTitle}>🎯 物品特征描述</View>

        <View className={styles.formItem}>
          <Text className={styles.label}>
            <Text className={styles.required}>*</Text>请描述物品独有特征
          </Text>
          <Textarea
            className={styles.textarea}
            placeholder='请详细描述物品的独有特征，如划痕、标记、特殊装饰等，越详细越有助于核实...'
            value={description}
            onInput={(e) => setDescription(e.detail.value)}
            maxlength={500}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>佐证照片（可选）</Text>
          <View className={styles.uploadArea}>
            {images.length < 3 && (
              <View className={styles.uploadBtn}>
                <Text className={styles.plusIcon}>+</Text>
                <Text>添加照片</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View className={styles.submitBar}>
        <View
          className={classnames(styles.submitBtn, !canSubmit && styles.disabled)}
          onClick={handleSubmit}
        >
          提交认领申请
        </View>
      </View>
    </View>
  )
}

export default ClaimPage
