import React, { useState, useMemo } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import classnames from 'classnames'
import { useAppStore } from '@/store'
import type { Report } from '@/store'
import { formatTime } from '@/utils/index'

const reasonMap: Record<string, string> = {
  fake: '虚假信息',
  stolen: '疑似赃物',
  offensive: '违规内容',
  scam: '疑似诈骗',
  duplicate: '重复发布',
  other: '其他原因'
}

const ReportManagePage: React.FC = () => {
  const reports = useAppStore((state) => state.reports)
  const updateReportStatus = useAppStore((state) => state.updateReportStatus)
  const updateItemStatus = useAppStore((state) => state.updateItemStatus)
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending')

  const filteredReports = useMemo(() => {
    if (activeTab === 'all') {
      return reports
    }
    return reports.filter((r) => r.status === 'pending')
  }, [reports, activeTab])

  const handleResolve = (report: Report) => {
    Taro.showModal({
      title: '处理举报',
      content: `确定将"${report.itemTitle}"下架处理吗？相关物品信息将被移除。`,
      success: (res) => {
        if (res.confirm) {
          updateReportStatus(report.id, 'resolved')
          updateItemStatus(report.itemId, 'closed')
          Taro.showToast({
            title: '已处理',
            icon: 'success'
          })
        }
      }
    })
  }

  const handleReject = (report: Report) => {
    Taro.showModal({
      title: '驳回举报',
      content: '确定驳回此举报吗？请确认已核实相关信息。',
      success: (res) => {
        if (res.confirm) {
          updateReportStatus(report.id, 'rejected')
          Taro.showToast({
            title: '已驳回',
            icon: 'success'
          })
        }
      }
    })
  }

  const goToItemDetail = (itemId: string) => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${itemId}`
    })
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '待处理'
      case 'resolved':
        return '已处理'
      case 'rejected':
        return '已驳回'
      default:
        return '未知'
    }
  }

  const pendingCount = reports.filter((r) => r.status === 'pending').length

  return (
    <View className={styles.page}>
      <View className={styles.filterTabs}>
        <View
          className={classnames(styles.tabItem, activeTab === 'pending' && styles.active)}
          onClick={() => setActiveTab('pending')}
        >
          待处理
          {pendingCount > 0 && <View className={styles.countBadge}>{pendingCount}</View>}
        </View>
        <View
          className={classnames(styles.tabItem, activeTab === 'all' && styles.active)}
          onClick={() => setActiveTab('all')}
        >
          全部
        </View>
      </View>

      {filteredReports.length > 0 ? (
        filteredReports.map((report) => (
          <View key={report.id} className={styles.reportCard}>
            <View className={styles.reportHeader}>
              <View className={styles.reportInfo}>
                <View className={styles.reportTitle}>
                  举报物品：{report.itemTitle}
                  <View className={classnames(styles.statusBadge, report.status)}>
                    {getStatusText(report.status)}
                  </View>
                </View>
                <View>
                  <View className={styles.reportReason}>
                    原因：{reasonMap[report.reason] || report.reason}
                  </View>
                  <Text className={styles.reportTime}>
                    {formatTime(report.createdAt)}
                  </Text>
                </View>
              </View>
            </View>

            <View className={styles.reportContent}>
              {report.description}
            </View>

            <View
              className={styles.itemLink}
              onClick={() => goToItemDetail(report.itemId)}
            >
              <Text className={styles.linkIcon}>📦</Text>
              <Text className={styles.linkText}>查看被举报物品详情</Text>
              <Text className={styles.arrow}>›</Text>
            </View>

            <View className={styles.reporter}>
              <Text className={styles.reporterName}>举报人：{report.reporter}</Text>
              <Text className={styles.reporterPhone}>{report.reporterPhone}</Text>
            </View>

            {report.status === 'pending' && (
              <View className={styles.actionBtns}>
                <View
                  className={`${styles.btn} ${styles.rejectBtn}`}
                  onClick={() => handleReject(report)}
                >
                  驳回举报
                </View>
                <View
                  className={`${styles.btn} ${styles.resolveBtn}`}
                  onClick={() => handleResolve(report)}
                >
                  确认处理
                </View>
              </View>
            )}
          </View>
        ))
      ) : (
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>✅</Text>
          <Text className={styles.emptyText}>
            {activeTab === 'pending' ? '暂无待处理举报' : '暂无举报记录'}
          </Text>
        </View>
      )}
    </View>
  )
}

export default ReportManagePage
