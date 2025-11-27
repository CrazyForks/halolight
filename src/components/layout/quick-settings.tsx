"use client"

import { AnimatePresence, motion } from "framer-motion"
import {
  BadgeCheck,
  Brush,
  Check,
  Monitor,
  Moon,
  Palette,
  PanelsTopLeft,
  Settings2,
  Sun,
} from "lucide-react"
import { useTheme } from "next-themes"
import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { type SkinPreset, useUiSettingsStore } from "@/stores/ui-settings-store"

const themeOptions = [
  { id: "light", label: "浅色", icon: Sun },
  { id: "dark", label: "深色", icon: Moon },
  { id: "system", label: "系统", icon: Monitor },
] as const

const skinPresets: Array<{
  id: SkinPreset
  name: string
  description: string
  colors: string[]
}> = [
  {
    id: "default",
    name: "经典",
    description: "稳重中性色，强调内容对比",
    colors: ["#0f172a", "#6366f1", "#14b8a6"],
  },
  {
    id: "ocean",
    name: "深海蓝",
    description: "蓝绿渐变，冷静科技感",
    colors: ["#0ea5e9", "#2563eb", "#0ea5e9"],
  },
  {
    id: "sunset",
    name: "暮光橙",
    description: "橙粉撞色，营造活力氛围",
    colors: ["#f97316", "#f43f5e", "#f59e0b"],
  },
  {
    id: "aurora",
    name: "极光绿",
    description: "青绿 + 紫色，偏向未来感",
    colors: ["#22c55e", "#10b981", "#a855f7"],
  },
]

export function QuickSettings() {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const { skin, setSkin, showFooter, showTabBar, setShowFooter, setShowTabBar } =
    useUiSettingsStore()
  const [open, setOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleThemeChange = React.useCallback(
    async (newTheme: string) => {
      const currentTheme = resolvedTheme || theme || "light"
      const isDark = currentTheme === "dark"

      let willBeDark = false
      if (newTheme === "dark") {
        willBeDark = true
      } else if (newTheme === "light") {
        willBeDark = false
      } else if (newTheme === "system") {
        willBeDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      }

      if (isDark === willBeDark) {
        setTheme(newTheme)
        return
      }

      const supportsViewTransitions =
        typeof document !== "undefined" &&
        "startViewTransition" in document &&
        typeof document.startViewTransition === "function"

      if (!supportsViewTransitions) {
        setTheme(newTheme)
        return
      }

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setTheme(newTheme)
        return
      }

      const button = document.querySelector<HTMLButtonElement>("[aria-label='界面设置']")
      const rect = button?.getBoundingClientRect()
      const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2
      const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2

      const maxRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      )

      const clipPathStart = `circle(0px at ${x}px ${y}px)`
      const clipPathEnd = `circle(${maxRadius}px at ${x}px ${y}px)`

      if (!willBeDark) {
        document.documentElement.classList.add("transitioning-to-light")
      }

      try {
        const transition = document.startViewTransition(() => {
          setTheme(newTheme)
        })

        await transition.ready

        const animation = document.documentElement.animate(
          {
            clipPath: willBeDark
              ? [clipPathStart, clipPathEnd]
              : [clipPathEnd, clipPathStart],
          },
          {
            duration: 400,
            easing: "cubic-bezier(0.4, 0, 0.2, 1)",
            pseudoElement: willBeDark
              ? "::view-transition-new(root)"
              : "::view-transition-old(root)",
          }
        )

        await animation.finished
      } catch {
        setTheme(newTheme)
      } finally {
        document.documentElement.classList.remove("transitioning-to-light")
      }
    },
    [resolvedTheme, theme, setTheme]
  )

  const handleSkinChange = React.useCallback(
    async (nextSkin: SkinPreset) => {
      if (skin === nextSkin) return

      const supportsViewTransitions =
        typeof document !== "undefined" &&
        "startViewTransition" in document &&
        typeof document.startViewTransition === "function"

      if (!supportsViewTransitions || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setSkin(nextSkin)
        return
      }

      const button = document.querySelector<HTMLButtonElement>("[aria-label='界面设置']")
      const rect = button?.getBoundingClientRect()
      const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2
      const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2
      const maxRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      )

      const clipPathStart = `circle(0px at ${x}px ${y}px)`
      const clipPathEnd = `circle(${maxRadius}px at ${x}px ${y}px)`

      try {
        const transition = document.startViewTransition(() => {
          setSkin(nextSkin)
        })
        await transition.ready
        const animation = document.documentElement.animate(
          { clipPath: [clipPathStart, clipPathEnd] },
          {
            duration: 420,
            easing: "cubic-bezier(0.4, 0, 0.2, 1)",
            pseudoElement: "::view-transition-new(root)",
          }
        )
        await animation.finished
      } catch {
        setSkin(nextSkin)
      }
    },
    [skin, setSkin]
  )

  const currentTheme = resolvedTheme || theme || "system"

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="界面设置">
          <Settings2 className="h-5 w-5" />
          <Badge
            variant="secondary"
            className="absolute -right-1 -top-1 h-4 px-1 text-[10px]"
          >
            UI
          </Badge>
        </Button>
      </PopoverTrigger>
      <AnimatePresence>
        {open && (
          <PopoverContent align="end" className="w-80 p-0" forceMount asChild>
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.18, ease: [0.22, 0.68, 0, 1] }}
            >
              <div className="flex items-center justify-between border-b px-4 py-3">
                <div>
                  <p className="text-sm font-semibold">界面设置</p>
                  <p className="text-xs text-muted-foreground">主题 · 皮肤 · 布局</p>
                </div>
                <BadgeCheck className="h-4 w-4 text-primary" />
              </div>

              <div className="space-y-4 p-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Palette className="h-4 w-4" />
                    <span>主题模式</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {themeOptions.map((option) => {
                      const isActive = mounted && currentTheme === option.id
                      return (
                        <Button
                          key={option.id}
                          type="button"
                          variant="outline"
                          className="relative h-auto flex flex-col items-start justify-center gap-1 rounded-lg py-2 overflow-hidden border-border/70"
                          asChild
                        >
                          <motion.button
                            type="button"
                            onClick={() => handleThemeChange(option.id)}
                            whileTap={{ scale: 0.98 }}
                            transition={{ duration: 0.12 }}
                            className={cn(
                              "relative w-full rounded-md px-2 py-1.5 text-left",
                              isActive ? "text-primary" : "text-foreground"
                            )}
                          >
                            {isActive && (
                              <motion.span
                                layoutId="theme-highlight"
                                className="absolute inset-0 rounded-md border border-primary/40 bg-primary/10 shadow-sm"
                                transition={{ type: "spring", stiffness: 320, damping: 28 }}
                              />
                            )}
                            <span className="relative flex flex-col gap-1">
                              <option.icon className="h-4 w-4" />
                              <span className="text-xs">{option.label}</span>
                            </span>
                          </motion.button>
                        </Button>
                      )
                    })}
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Brush className="h-4 w-4" />
                    <span>配色皮肤</span>
                    <Badge variant="outline" className="h-5 px-1.5 text-[11px]">
                      实时预览
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {skinPresets.map((preset) => {
                      const active = skin === preset.id
                      return (
                        <motion.button
                          key={preset.id}
                          type="button"
                          className={cn(
                            "group relative overflow-hidden rounded-lg border p-3 text-left transition hover:border-primary/60 hover:bg-primary/5",
                            active && "border-primary ring-1 ring-primary/50 bg-primary/5"
                          )}
                          onClick={() => handleSkinChange(preset.id)}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.99 }}
                          transition={{ duration: 0.12 }}
                        >
                          {active && (
                            <motion.span
                              layoutId="skin-highlight"
                              className="absolute inset-0 rounded-lg border border-primary/50 bg-primary/5"
                              transition={{ type: "spring", stiffness: 280, damping: 26 }}
                            />
                          )}
                          <div className="relative flex items-center justify-between text-sm font-semibold">
                            <span>{preset.name}</span>
                            {active && <Check className="h-4 w-4 text-primary" />}
                          </div>
                          <p className="relative mt-1 text-xs text-muted-foreground line-clamp-2">
                            {preset.description}
                          </p>
                          <div className="relative mt-2 flex gap-1">
                            {preset.colors.map((color) => (
                              <motion.span
                                key={color}
                                layout
                                className="h-6 w-6 rounded-md border border-border/70"
                                style={{ backgroundColor: color }}
                                whileHover={{ scale: 1.05 }}
                              />
                            ))}
                          </div>
                        </motion.button>
                      )
                    })}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <PanelsTopLeft className="h-4 w-4" />
                    <span>布局元素</span>
                  </div>
                  <div className="space-y-2">
                    <motion.div
                      className="flex items-center justify-between rounded-lg border border-border/70 bg-muted/40 px-3 py-2"
                      layout
                    >
                      <div>
                        <p className="text-sm font-medium">显示底部</p>
                        <p className="text-xs text-muted-foreground">控制页脚和快捷入口展示</p>
                      </div>
                      <Switch checked={showFooter} onCheckedChange={setShowFooter} />
                    </motion.div>
                    <motion.div
                      className="flex items-center justify-between rounded-lg border border-border/70 bg-muted/40 px-3 py-2"
                      layout
                    >
                      <div>
                        <p className="text-sm font-medium">显示多标签</p>
                        <p className="text-xs text-muted-foreground">隐藏后不再展示顶部标签栏</p>
                      </div>
                      <Switch checked={showTabBar} onCheckedChange={setShowTabBar} />
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </PopoverContent>
        )}
      </AnimatePresence>
    </Popover>
  )
}
