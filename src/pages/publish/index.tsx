import React, { useState } from 'react'
import { View, Text, Input, Textarea, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import classnames from 'classnames'
import type { ItemType, ItemCategory } from '@/types'
import { categoryMap, categoryList } from '@/types'
import { useAppStore } from '@/store'

const defaultImages: Record<string, string[]> = {
  electronics: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'],
  cards: ['https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=400&fit=crop'],
  keys: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop'],
  bags: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop'],
  documents: ['https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=400&fit=crop'],
  clothes: ['https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=400&fit=crop'],
  accessories: ['https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=400&h=400&fit=crop'],
  pets: ['https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop'],
  other: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop']
}

const PublishPage: React.FC = () => {
  const addItem = useAppStore((state) => state.addItem)
  const currentUser = useAppStore((state) => state.currentUser)
  const [type, setType] = useState<ItemType>('lost')
  const [category, setCategory] = useState<ItemCategory>('other')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState('')
  const [location, setLocation] = useState('')
  const [building, setBuilding] = useState('')
  const [time, setTime] = useState('')
  const [contactName, setContactName] = useState('')
  const [contact, setContact] = useState('')
  const [images, setImages] = useState<string[]>([])

  const handleChooseImage = () => {
    Taro.chooseImage({
      count: 6 - images.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        setImages([...images, ...res.tempFilePaths])
      }
    })
  }

  const handleDeleteImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
  }

  const canSubmit = title && description && location && contact

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setColor('')
    setLocation('')
    setBuilding('')
    setTime('')
    setContactName('')
    setContact('')
    setImages([])
  }

  const handleSubmit = () => {
    if (!canSubmit) {
      Taro.showToast({
        title: '请填写完整信息',
        icon: 'none'
      })
      return
    }

    Taro.showLoading({ title: '提交中...' })

    setTimeout(() => {
      const itemImages = images.length > 0 ? images : defaultImages[category] || defaultImages.other
      
      addItem({
        type,
        category,
        title,
        description,
        color: color || '未填写',
        location,
        building: building || '未填写',
        lostTime: time || '未填写',
        contactName: contactName || currentUser.name,
        contact,
        images: itemImages,
        publisher: currentUser.name,
        publisherPhone: currentUser.phone
      })

      Taro.hideLoading()
      Taro.showToast({
        title: '发布成功，等待审核',
        icon: 'success',
        duration: 2000
      })
      resetForm()
      setTimeout(() => {
        Taro.switchTab({ url: '/pages/home/index' })
      }, 1500)
    }, 800)
  }

  return (
    <View className={styles.page}>
      <View className={styles.typeSelector}>
        <View
          className={classnames(styles.typeBtn, type === 'lost' ? styles.typeBtnActive : styles.typeBtnInactive)}
          onClick={() => setType('lost')}
        >
          🔍 寻物启事
        </View>
        <View
          className={classnames(styles.typeBtn, type === 'found' ? styles.typeBtnActive : styles.typeBtnInactive)}
          onClick={() => setType('found')}
        >
          🎁 失物招领
        </View>
      </View>

      <View className={styles.tips}>
        <View className={styles.tipsTitle}>💡 温馨提示</View>
        <View>请如实填写物品信息，虚假信息将被下架并记入信用档案。发布后需等待物业审核。</View>
      </View>

      <View className={styles.formCard}>
        <View className={styles.formTitle}>📋 基本信息</View>

        <View className={styles.formItem}>
          <Text className={styles.label}>
            <Text className={styles.required}>*</Text>物品类别
          </Text>
          <View className={styles.categories}>
            {categoryList.map(cat => (
              <View
                key={cat}
                className={classnames(styles.categoryTag, category === cat && styles.active)}
                onClick={() => setCategory(cat)}
              >
                {categoryMap[cat]}
              </View>
            ))}
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>
            <Text className={styles.required}>*</Text>物品名称
          </Text>
          <Input
            className={styles.input}
            placeholder={`请输入${type === 'lost' ? '丢失' : '捡到'}的物品名称`}
            value={title}
            onInput={(e) => setTitle(e.detail.value)}
            maxlength={50}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>颜色特征</Text>
          <Input
            className={styles.input}
            placeholder='请输入物品的颜色和主要特征'
            value={color}
            onInput={(e) => setColor(e.detail.value)}
            maxlength={30}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>
            <Text className={styles.required}>*</Text>
            {type === 'lost' ? '丢失' : '捡到'}地点
          </Text>
          <Input
            className={styles.input}
            placeholder={`请输入${type === 'lost' ? '丢失' : '捡到'}的具体地点`}
            value={location}
            onInput={(e) => setLocation(e.detail.value)}
            maxlength={50}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>楼栋区域</Text>
          <Input
            className={styles.input}
            placeholder='如：3号楼、地下车库B1等'
            value={building}
            onInput={(e) => setBuilding(e.detail.value)}
            maxlength={30}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>
            {type === 'lost' ? '丢失' : '捡到'}时间
          </Text>
          <Input
            className={styles.input}
            placeholder='如：今天上午10点左右'
            value={time}
            onInput={(e) => setTime(e.detail.value)}
            maxlength={30}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>
            <Text className={styles.required}>*</Text>详细描述
          </Text>
          <Textarea
            className={styles.textarea}
            placeholder='请详细描述物品特征，越详细越容易被找到...'
            value={description}
            onInput={(e) => setDescription(e.detail.value)}
            maxlength={500}
          />
        </View>
      </View>

      <View className={styles.formCard}>
        <View className={styles.formTitle}>📷 物品照片</View>
        <View className={styles.formItem}>
          <View className={styles.uploadArea}>
            {images.map((img, index) => (
              <View key={index} className={styles.uploadItem}>
                <Image className={styles.uploadImg} src={img} mode='aspectFill' />
                <View className={styles.deleteBtn} onClick={() => handleDeleteImage(index)}>×</View>
              </View>
            ))}
            {images.length < 6 && (
              <View className={styles.uploadBtn} onClick={handleChooseImage}>
                <Text className={styles.plusIcon}>+</Text>
                <Text>添加图片</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View className={styles.formCard}>
        <View className={styles.formTitle}>📞 联系方式</View>
        <View className={styles.formItem}>
          <Text className={styles.label}>联系人</Text>
          <Input
            className={styles.input}
            placeholder='请输入您的称呼'
            value={contactName}
            onInput={(e) => setContactName(e.detail.value)}
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
          发布信息
        </View>
      </View>
    </View>
  )
}

export default PublishPage
