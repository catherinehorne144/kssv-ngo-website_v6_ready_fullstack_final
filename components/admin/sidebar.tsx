"use client"
// ADD AT TOP with other imports
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Handshake,
  MessageSquare,
  Quote,
  FileText,
  FolderKanban,
  DollarSign,
  BarChart3,
  UserPlus,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar, // ← REPLACED Target with Calendar for Workplans
} from "lucide-react"
import { useEffect, useState } from "react"
import { createServerClientInstance } from "@/lib/supabase/server"
import { motion, AnimatePresence } from "framer-motion"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Volunteers", href: "/admin/volunteers", icon: Users },
  { name: "Members", href: "/admin/members", icon: UserCheck },
  { name: "Partners", href: "/admin/partners", icon: Handshake },
  { name: "Contact Messages", href: "/admin/messages", icon: MessageSquare },
  { name: "Testimonials", href: "/admin/testimonials", icon: Quote },
  { name: "Blog Posts", href: "/admin/blog", icon: FileText },
  { name: "Projects", href: "/admin/projects", icon: FolderKanban },
  { name: "Workplans", href: "/admin/workplans", icon: Calendar }, // ← REPLACED Programs with Workplans
  { name: "Donations", href: "/admin/donations", icon: DollarSign },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
]

const superAdminNavigation = [
  { name: "Add Admin", href: "/admin/setup", icon: UserPlus, superAdminOnly: true },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [isOpen, setIsOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    async function checkSuperAdmin() {
      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          const { data: adminUser } = await supabase
            .from("admin_users")
            .select("role")
            .eq("id", user.id)
            .single()
          setIsSuperAdmin(adminUser?.role === "super_admin")
        }
      } catch (err) {
        console.error("Error checking super admin:", err)
      }
    }

    checkSuperAdmin()
  }, [])

  const renderNavLink = (item: any) => {
    const isActive = pathname === item.href
    return (
      <Link
        key={item.name}
        href={item.href}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        <item.icon size={18} />
        <AnimatePresence>
          {isOpen && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
            >
              {item.name}
            </motion.span>
          )}
        </AnimatePresence>
      </Link>
    )
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-card p-2 rounded-md border border-border"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <motion.aside
        initial={{ width: isOpen ? 256 : 80 }}
        animate={{ width: isOpen ? 256 : 80 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className={cn(
          "fixed lg:static top-0 left-0 h-full lg:h-auto z-40 flex flex-col bg-card border-r border-border transition-all duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <AnimatePresence>
            {isOpen && (
              <motion.div
                key="title"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="font-serif text-xl font-bold text-foreground">KSSV Admin</h2>
                <p className="text-sm text-muted-foreground mt-1">Content Management</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Collapse Button */}
          <button
            className="hidden lg:block p-1 border border-border rounded-md hover:bg-muted"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigation.map(renderNavLink)}

          {isSuperAdmin && (
            <>
              <div className="my-4 border-t border-border" />
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                >
                  Super Admin
                </motion.div>
              )}
              {superAdminNavigation.map(renderNavLink)}
            </>
          )}
        </nav>
      </motion.aside>
    </>
  )
}