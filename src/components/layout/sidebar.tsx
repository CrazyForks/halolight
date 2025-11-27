"use client"

import { AnimatePresence,motion } from "framer-motion"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { getMenuPermission, MENU_ITEMS } from "@/config/routes"
import { cn } from "@/lib/utils"
import { usePermission } from "@/providers/permission-provider"
import { useNavigationStore } from "@/stores/navigation-store"

interface SidebarProps {
  collapsed: boolean
  onCollapsedChange: (collapsed: boolean) => void
  expandedWidth?: number | string
  collapsedWidth?: number | string
  fixed?: boolean
}

export function Sidebar({
  collapsed,
  onCollapsedChange,
  expandedWidth = 220,
  collapsedWidth = 64,
  fixed = true,
}: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const startNavigation = useNavigationStore((state) => state.startNavigation)
  const { hasPermission } = usePermission()

  const handleNavigate = React.useCallback(
    (href: string, label: string) => {
      const required = getMenuPermission(href)
      if (required && !hasPermission(required)) return
      if (pathname === href) return
      startNavigation({ path: href, label, source: "sidebar" })
      router.push(href)
    },
    [hasPermission, pathname, router, startNavigation]
  )

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? collapsedWidth : expandedWidth }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className={cn(
          fixed ? "fixed left-0 top-0 h-screen" : "relative h-full",
          "z-40 border-r border-border bg-sidebar",
          "flex flex-col"
        )}
        style={{ pointerEvents: "auto" }}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <span className="text-sm font-bold text-primary-foreground">
                    A
                  </span>
                </div>
                <span className="font-semibold text-sidebar-foreground">
                  Admin Pro
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          {collapsed && (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary mx-auto">
              <span className="text-sm font-bold text-primary-foreground">
                A
              </span>
            </div>
          )}
        </div>

        {/* 导航菜单 */}
        <ScrollArea className="flex-1 py-4">
          <nav className="space-y-1 px-2">
            {MENU_ITEMS.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              const required = getMenuPermission(item.href)
              const allowed = required ? hasPermission(required) : true

              const linkContent = (
                <Link
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault()
                    handleNavigate(item.href, item.title)
                  }}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    allowed
                      ? "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      : "opacity-60 cursor-not-allowed",
                    isActive && allowed
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70"
                  )}
                  aria-disabled={!allowed}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                  </motion.div>
                  <AnimatePresence mode="wait">
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.15 }}
                        className="truncate"
                      >
                        {item.title}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 h-8 w-1 rounded-r-full bg-primary"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              )

              if (collapsed) {
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>
                      <div className="relative">{linkContent}</div>
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={10}>
                      {item.title}
                    </TooltipContent>
                  </Tooltip>
                )
              }

              return (
                <div key={item.href} className="relative">
                  {linkContent}
                </div>
              )
            })}
          </nav>
        </ScrollArea>

        {/* 折叠按钮 */}
        <div className="border-t border-border p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCollapsedChange(!collapsed)}
            className="w-full justify-center"
          >
            <motion.div
              animate={{ rotate: collapsed ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronLeft className="h-4 w-4" />
            </motion.div>
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="ml-2"
                >
                  收起菜单
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </motion.aside>
    </TooltipProvider>
  )
}
