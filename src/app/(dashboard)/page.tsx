"use client"

import { ConfigurableDashboard } from "@/components/dashboard"

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">仪表盘</h1>
        <p className="text-muted-foreground mt-1">
          可拖拽、可配置的仪表盘，支持添加/删除/重置部件，配置持久化本地存储。
        </p>
      </div>
      <ConfigurableDashboard />
    </div>
  )
}
