import React, { useMemo } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import { useAppStore } from '@/store'

const MinePage: React.FC = () => {
  const currentUser = useAppStore((state) => state.currentUser)
  const items = useAppStore((state) => state.items)
  const reports = useAppStore((state) => state.reports)
  const switchRole = useAppStore((state) => state.switchRole)

  const pendingCount = useMemo(() => {
    return items.filter((i) => i.status === 'pending').length
  }, [items])

  const reportCount = useMemo(() => {
    return reports.filter((r) => r.status === 'pending').length
  }, [reports])

  const expiredCount = useMemo(() => {
    const now = Date.now()
    return items.filter((item) => {
      const days = (now - new Date(item.createdAt).getTime()) / (1000 * 60 * 60 * 24)
      return days >= 10 && item.status === 'active'
    }).length
  }, [items])

  const myPublishCount = useMemo(() => {
    return items.filter((i) => i.publisher === currentUser.name).length
  }, [items, currentUser.name])

  const claimedCount = useMemo(() => {
    return items.filter(
      (i) => i.status === 'claimed' && i.publisher === currentUser.name
    ).length
  }, [items, currentUser.name])

  const goToMyPublish = () => {
    Taro.navigateTo({ url: '/pages/myPublish/index' })
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
    Taro.navigateTo({ url: '/pages/review/index' })
  }

  const goToReportManage = () => {
    Taro.navigateTo({ url: '/pages/reportManage/index' })
  }

  const goToExpired = () => {
    Taro.navigateTo({ url: '/pages/expired/index' })
  }

  const goToSettings = () => {
    Taro.showToast({ title: '设置', icon: 'none' })
  }

  const handleSwitchRole = () => {
    Taro.showActionSheet({
      itemList: ['🏠 小区住户', '👮 保安人员', '🏢 物业管理员'],
      success: (res) => {
        const roles: Array<'resident' | 'security' | 'property'> = ['resident', 'security', 'property']
        switchRole(roles[res.tapIndex])
        Taro.showToast({
          title: '身份已切换',
          icon: 'success'
        })
      }
    })
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

  const isAdmin = currentUser.role === 'property' || currentUser.role === 'security'

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.header}>
        <View className={styles.userInfo}>
          <Image className={styles.avatar} src={currentUser.avatar} mode='aspectFill' />
          <View className={styles.userDetail}>
            <View className={styles.userName}>{currentUser.name}</View>
            <View className={styles.roleTag} onClick={handleSwitchRole}>
              {getRoleText(currentUser.role)}
              <Text className={styles.switchIcon}>⇄</Text>
            </View>
            <View className={styles.building}>📍 {currentUser.building}</View>
          </View>
        </View>
      </View>

      <View className={styles.stats}>
        <View className={styles.statItem}>
          <View className={styles.statNum}>{myPublishCount}</View>
          <View className={styles.statLabel}>发布数</View>
        </View>
        <View className={styles.statItem}>
          <View className={styles.statNum}>{claimedCount}</View>
          <View className={styles.statLabel}>找回数</View>
        </View>
        <View className={styles.statItem}>
          <View className={styles.statNum}>{currentUser.thankCount}</View>
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

      {isAdmin && (
        <View className={styles.section}>
          <View className={styles.sectionTitle}>
            管理后台
            <Text className={styles.adminTip}>（{currentUser.role === 'property' ? '物业' : '保安'}）</Text>
          </View>
          <View className={styles.menuCard}>
            <View className={styles.menuItem} onClick={goToReview}>
              <View className={`${styles.menuIcon} ${styles.iconGreen}`}>✅</View>
              <View className={styles.menuContent}>
                <View className={styles.menuTitle}>
                  发布审核
                  {pendingCount > 0 && (
                    <View className={styles.badge}>{pendingCount}</View>
                  )}
                </View>
                <View className={styles.menuDesc}>审核用户发布的信息</View>
              </View>
              <Text className={styles.menuArrow}>›</Text>
            </View>
            <View className={styles.menuItem} onClick={goToReportManage}>
              <View className={`${styles.menuIcon} ${styles.iconRed}`}>🚨</View>
              <View className={styles.menuContent}>
                <View className={styles.menuTitle}>
                  举报管理
                  {reportCount > 0 && (
                    <View className={styles.badge}>{reportCount}</View>
                  )}
                </View>
                <View className={styles.menuDesc}>处理虚假信息举报</View>
              </View>
              <Text className={styles.menuArrow}>›</Text>
            </View>
            <View className={styles.menuItem} onClick={goToExpired}>
              <View className={`${styles.menuIcon} ${styles.iconOrange}`}>⏰</View>
              <View className={styles.menuContent}>
                <View className={styles.menuTitle}>
                  过期下架
                  {expiredCount > 0 && (
                    <View className={styles.badge}>{expiredCount}</View>
                  )}
                </View>
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
