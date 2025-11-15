"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, X } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowInstallPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handler)

    return () => {
      window.removeEventListener("beforeinstallprompt", handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      setDeferredPrompt(null)
      setShowInstallPrompt(false)
    }
  }

  if (!showInstallPrompt) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="bg-card border border-border rounded-lg shadow-2xl p-4 flex items-start gap-3">
        <div className="flex-1">
          <h3 className="font-serif font-bold text-foreground mb-1">Install KSSV App</h3>
          <p className="text-sm text-muted-foreground mb-3">Install our app for quick access and offline support</p>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleInstall} className="font-accent">
              <Download className="w-4 h-4 mr-2" />
              Install
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowInstallPrompt(false)}>
              Later
            </Button>
          </div>
        </div>
        <button
          onClick={() => setShowInstallPrompt(false)}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close install prompt"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
