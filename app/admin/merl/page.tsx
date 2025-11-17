// app/admin/merl/page.tsx
'use client'

import { AdminHeader } from "@/components/admin/header"
import { MERLDashboard } from "@/components/merl/MERLDashboard"
import { useEffect, useState } from 'react'
import type { Workplan } from '@/lib/types/workplan'

export default function MERLPage() {
  const [workplans, setWorkplans] = useState<Workplan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadWorkplans = async () => {
      try {
        const response = await fetch('/api/workplans')
        if (response.ok) {
          const data = await response.json()
          setWorkplans(data)
        }
      } catch (error) {
        console.error('Error loading workplans:', error)
      } finally {
        setLoading(false)
      }
    }

    loadWorkplans()
  }, [])

  if (loading) {
    return (
      <>
        <AdminHeader title="MERL Dashboard" description="Monitoring, Evaluation, Research & Learning" />
        <div className="p-6 flex justify-center items-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading MERL Dashboard...</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <AdminHeader title="MERL Dashboard" description="Monitoring, Evaluation, Research & Learning" />
      <div className="p-6">
        <MERLDashboard workplans={workplans} />
      </div>
    </>
  )
}