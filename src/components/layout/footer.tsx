"use client"

import { motion } from "framer-motion"
import { Heart, Sparkles } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import * as React from "react"

import { Separator } from "@/components/ui/separator"
import { projectInfo } from "@/lib/project-info"
import { useNavigationStore } from "@/stores/navigation-store"

import { PendingOverlay } from "./pending-overlay"

const quickLinks = [
  { href: "/", label: "首页" },
  { href: "/users", label: "用户管理" },
  { href: "/analytics", label: "数据分析" },
  { href: "/documents", label: "文档管理" },
]

const socialLinks = [
  { href: projectInfo.repo, label: "GitHub" },
  { href: "mailto:h7ml@qq.com", label: "Email" },
  { href: projectInfo.homepage, label: "官网" },
]

export function Footer() {
  const pathname = usePathname()
  const router = useRouter()
  const { pendingPath, label, source, startNavigation } = useNavigationStore()
  const titleMap: Record<string, string> = {
    "/": "首页",
    "/users": "用户管理",
    "/analytics": "数据分析",
    "/documents": "文档管理",
    "/files": "文件存储",
    "/messages": "消息中心",
    "/calendar": "日程安排",
    "/notifications": "通知中心",
    "/settings": "系统设置",
    "/profile": "个人资料",
    "/docs": "帮助文档",
  }

  const handleQuickLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("http") || href.startsWith("mailto:") || href === pathname) {
      return
    }

    e.preventDefault()
    startNavigation({
      path: href,
      label: titleMap[href],
      source: "footer",
    })

    setTimeout(() => {
      router.push(href)
    }, 50)
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden border-t border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="absolute inset-0 pointer-events-none overflow-hidden lg:block hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-0 h-48 w-48 -translate-x-1/2 rounded-full bg-violet-500/15 blur-3xl"
        />
      </div>

      <div className="relative mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="hidden lg:grid grid-cols-1 gap-x-8 gap-y-6 py-6 sm:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 rounded-xl bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                <Sparkles className="h-5 w-5 text-white" />
                <div className="absolute inset-0 rounded-xl bg-linear-to-br from-white/20 to-transparent" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">{projectInfo.name}</h3>
                <p className="text-xs text-muted-foreground">v0.1.0</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {projectInfo.desc}
            </p>
            <p className="text-xs text-muted-foreground">
              作者：<span className="text-primary font-medium">{projectInfo.author}</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-3"
          >
            <h4 className="text-sm font-semibold text-foreground">快速链接</h4>
            <ul className="space-y-1.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={(e) => handleQuickLinkClick(e, link.href)}
                    className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-3"
          >
            <h4 className="text-sm font-semibold text-foreground">关注我们</h4>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border/50 bg-card/50 text-muted-foreground shadow-sm transition-all hover:-translate-y-1 hover:border-primary/50 hover:text-primary hover:shadow-md"
                  title={link.label}
                >
                  <span className="text-sm font-semibold">{link.label[0]}</span>
                </a>
              ))}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              关注我们获取最新动态和更新信息
            </p>
          </motion.div>
        </div>

        <div className="lg:hidden space-y-4 py-6 text-sm text-muted-foreground">
          <div className="flex flex-col gap-1">
            <p className="text-base font-semibold text-foreground">{projectInfo.name}</p>
            <p className="text-xs">{projectInfo.desc}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleQuickLinkClick(e, link.href)}
                className="text-[13px] font-medium text-primary underline-offset-4 transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 text-xs">
            {socialLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <Separator className="bg-border/50" />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col items-center justify-between gap-3 py-4 sm:flex-row"
        >
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>© {currentYear} {projectInfo.name}.</span>
            <span>All rights reserved.</span>
          </div>

          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>Made with</span>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Heart className="h-4 w-4 text-red-500 fill-red-500" />
            </motion.span>
            <span>by</span>
            <a
              href={`https://github.com/${projectInfo.author}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              {projectInfo.author}
            </a>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              隐私政策
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors">
              服务条款
            </Link>
          </div>
        </motion.div>
      </div>

      <PendingOverlay
        visible={!!pendingPath}
        label={label}
        mode={source === "tabbar-refresh" ? "refresh" : "navigate"}
        delay={source === "tabbar-refresh" ? 0 : undefined}
      />
    </footer>
  )
}
