import React from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import type { UserProfile } from '@/types'

const mockUser: UserProfile = {
  id: 'u1',
  name: '张先生',
  avatar: 'https://picsum.photos/id/64/200/200',
  phone: '138****8888',
  building: '3号楼2单元1502室',
  role: 'resident',
  publishCount: 5,
  foundCount: 3,
  thankCount: 2
}

const MinePage: React.FC = () => {
  const goToMyPublish = () => {
    Taro.showToast({ title: '我的发布', icon: 'none' })
  }

  const goToMyClaim = () => {
    Taro.showToast({ title: '认领进度', icon: 'none' })
  }

  const goToThanks = () => {
    Taro.showToast({ title: '感谢记录', icon: 'none' })
  }

  const goToNotice = () => {
    Taro.navigateTo({ url: '/pages/notice/index' })
  }

  const goToReview = () => {
    Taro.showToast({ title: '物业审核', icon: 'none' })
  }

  const goToReport = () => {
    Taro.showToast({ title: '举报管理', icon: 'none' })
  }

  const goToExpired = () => {
    Taro.showToast({ title: '过期下架', icon: 'none' })
  }

  const goToSettings = () => {
    Taro.showToast({ title: '设置', icon: 'none' })
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case 'property':
        return '🏢 物业管理员'
      case 'security':
        return '👮 保安人员'
      default:
        return '🏠 小区住户'
    }
  }

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.header}>
        <View className={styles.userInfo}>
          <Image className={styles.avatar} src={mockUser.avatar} mode='aspectFill' />
          <View className={styles.userDetail}>
            <View className={styles.userName}>{mockUser.name}</View>
            <View className={styles.roleTag}>{getRoleText(mockUser.role)}</View>
            <View className={styles.building}>📍 {mockUser.building}</View>
          </View>
        </View>
      </View>

      <View className={styles.stats}>
        <View className={styles.statItem}>
          <View className={styles.statNum}>{mockUser.publishCount}</View>
          <View className={styles.statLabel}>发布数</View>
        </View>
        <View className={styles.statItem}>
          <View className={styles.statNum}>{mockUser.foundCount}</View>
          <View className={styles.statLabel}>找回数</View>
        </View>
        <View className={styles.statItem}>
          <View className={styles.statNum}>{mockUser.thankCount}</View>
          <View className={styles.statLabel}>感谢信</View>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionTitle}>我的发布</View>
        <View className={styles.menuCard}>
          <View className={styles.menuItem} onClick={goToMyPublish}>
            <View className={`${styles.menuIcon} ${styles.iconOrange}`}>📝</View>
            <View className={styles.menuContent}>
              <View className={styles.menuTitle}>我的发布</View>
              <View className={styles.menuDesc}>管理我发布的寻物和招领信息</View>
            </View>
            <Text className={styles.menuArrow}>›</Text>
          </View>
          <View className={styles.menuItem} onClick={goToMyClaim}>
            <View className={`${styles.menuIcon} ${styles.iconGreen}`}>🎯</View>
            <View className={styles.menuContent}>
              <View className={styles.menuTitle}>认领进度</View>
              <View className={styles.menuDesc}>查看我申请的认领处理进度</View>
            </View>
            <Text className={styles.menuArrow}>›</Text>
          </View>
          <View className={styles.menuItem} onClick={goToThanks}>
            <View className={`${styles.menuIcon} ${styles.iconRed}`}>💝</View>
            <View className={styles.menuContent}>
              <View className={styles.menuTitle}>感谢记录</View>
              <View className={styles.menuDesc}>记录收到和发出的感谢</View>
            </View>
            <Text className={styles.menuArrow}>›</Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionTitle}>便民服务</View>
        <View className={styles.menuCard}>
          <View className={styles.menuItem} onClick={goToNotice}>
            <View className={`${styles.menuIcon} ${styles.iconBlue}`}>📢</View>
            <View className={styles.menuContent}>
              <View className={styles.menuTitle}>公告栏</View>
              <View className={styles.menuDesc}>查看物业发布的通知公告</View>
            </View>
            <Text className={styles.menuArrow}>›</Text>
          </View>
          <View className={styles.menuItem} onClick={goToSettings}>
            <View className={`${styles.menuIcon} ${styles.iconOrange}`}>⚙️</View>
            <View className={styles.menuContent}>
              <View className={styles.menuTitle}>设置</View>
              <View className={styles.menuDesc}>个人信息、隐私设置</View>
            </View>
            <Text className={styles.menuArrow}>›</Text>
          </View>
        </View>
      </View>

      {mockUser.role === 'property' && (
        <View className={styles.section}>
          <View className={styles.sectionTitle}>物业管理</View>
          <View className={styles.menuCard}>
            <View className={styles.menuItem} onClick={goToReview}>
              <View className={`${styles.menuIcon} ${styles.iconGreen}`}>✅</View>
              <View className={styles.menuContent}>
                <View className={styles.menuTitle}>
                  发布审核
                  <Text className={styles.badge}>3</Text>
                </View>
                <View className={styles.menuDesc}>审核用户发布的信息</View>
              </View>
              <Text className={styles.menuArrow}>›</Text>
            </View>
            <View className={styles.menuItem} onClick={goToReport}>
              <View className={`${styles.menuIcon} ${styles.iconRed}`}>🚨</View>
              <View className={styles.menuContent}>
                <View className={styles.menuTitle}>举报管理</View>
                <View className={styles.menuDesc}>处理虚假信息举报</View>
              </View>
              <Text className={styles.menuArrow}>›</Text>
            </View>
            <View className={styles.menuItem} onClick={goToExpired}>
              <View className={`${styles.menuIcon} ${styles.iconOrange}`}>⏰</View>
              <View className={styles.menuContent}>
                <View className={styles.menuTitle}>过期下架</View>
                <View className={styles.menuDesc}>管理过期的物品信息</View>
              </View>
              <Text className={styles.menuArrow}>›</Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  )
}

export default MinePage
