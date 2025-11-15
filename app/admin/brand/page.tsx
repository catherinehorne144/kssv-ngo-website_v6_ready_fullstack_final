'use client'
import { useState, useEffect } from 'react'

export default function BrandSettings() {
  const [preview, setPreview] = useState('')
  useEffect(() => {
    async function load() {
      const res = await fetch('/api/branding')
      const data = await res.json()
      if (data && data.logo_url) setPreview(data.logo_url)
    }
    load()
  }, [])

  async function onFile(e) {
    const file = e.target.files[0]
    if (!file) return
    alert('Upload placeholder - replace with real upload flow in UI code')
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">Brand Settings</h2>
      <div className="mt-4">
        <p>Current logo preview:</p>
        {preview ? <img src={preview} alt="logo" style={{maxWidth:200}} /> : <p>No logo set</p>}
      </div>
      <div className="mt-4">
        <input type="file" accept="image/*" onChange={onFile} />
      </div>
    </div>
  )
}
