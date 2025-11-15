"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Reply, Trash2, Loader2, Search, Download } from "lucide-react"

export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [replyModalOpen, setReplyModalOpen] = useState(false)
  const [currentMsg, setCurrentMsg] = useState<any | null>(null)
  const [reply, setReply] = useState("")
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "replied" | "pending">("all")
  const { toast } = useToast()

  const supabase = createClient()

  useEffect(() => {
    fetchMessages()
  }, [])

  async function fetchMessages() {
    setLoading(true)
    const { data, error } = await supabase.from("messages").select("*").order("created_at", { ascending: false })
    if (error) {
      toast({ title: "Error", description: "Failed to fetch messages", variant: "destructive" })
      console.error(error)
    } else {
      setMessages(data || [])
    }
    setLoading(false)
  }

  async function handleDelete(id: string) {
    const confirmDelete = confirm("Are you sure you want to delete this message?")
    if (!confirmDelete) return

    const { error } = await supabase.from("messages").delete().eq("id", id)
    if (error) {
      toast({ title: "Error", description: "Failed to delete message", variant: "destructive" })
    } else {
      setMessages((prev) => prev.filter((m) => m.id !== id))
      toast({ title: "Deleted", description: "Message deleted successfully" })
    }
  }

  async function handleReplySubmit() {
    if (!reply.trim()) {
      toast({ title: "Error", description: "Reply cannot be empty", variant: "destructive" })
      return
    }

    const { error } = await supabase
      .from("messages")
      .update({ reply, replied: true })
      .eq("id", currentMsg.id)

    if (error) {
      toast({ title: "Error", description: "Failed to send reply", variant: "destructive" })
    } else {
      toast({ title: "Success", description: "Reply sent successfully" })
      setMessages((prev) =>
        prev.map((m) => (m.id === currentMsg.id ? { ...m, reply, replied: true } : m))
      )
      setReplyModalOpen(false)
      setReply("")
      setCurrentMsg(null)
    }
  }

  function exportCSV() {
    const header = ["ID", "Name", "Email", "Message", "Reply", "Status", "Created At"]
    const rows = messages.map((m) => [
      m.id,
      m.name || "",
      m.email || "",
      m.message || "",
      m.reply || "",
      m.replied ? "Replied" : "Pending",
      safeFormatDate(m.created_at),
    ])

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [header, ...rows]
        .map((e) => e.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.href = encodedUri
    link.download = "messages.csv"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  function safeFormatDate(dateString: string) {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return isNaN(date.getTime()) ? "Invalid date" : date.toLocaleString()
  }

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      msg.name?.toLowerCase().includes(search.toLowerCase()) ||
      msg.email?.toLowerCase().includes(search.toLowerCase()) ||
      msg.message?.toLowerCase().includes(search.toLowerCase())

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "replied" && msg.replied) ||
      (statusFilter === "pending" && !msg.replied)

    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Messages</h1>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64"
          />
          <Button variant="outline" onClick={exportCSV}>
            <Download className="h-4 w-4 mr-1" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="flex gap-2">
        {["all", "replied", "pending"].map((s) => (
          <Button
            key={s}
            variant={statusFilter === s ? "default" : "outline"}
            onClick={() => setStatusFilter(s as any)}
          >
            {s[0].toUpperCase() + s.slice(1)}
          </Button>
        ))}
      </div>

      <div className="border rounded-lg shadow-sm overflow-hidden bg-card">
        {loading ? (
          <div className="flex justify-center items-center py-12 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading messages...
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="flex justify-center items-center py-12 text-muted-foreground">
            No messages found.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr className="text-left">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Message</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMessages.map((msg, idx) => (
                <tr
                  key={msg.id}
                  className={`border-t hover:bg-muted/20 ${
                    idx % 2 === 0 ? "bg-muted/10" : "bg-background"
                  }`}
                >
                  <td className="p-3">{msg.name || "N/A"}</td>
                  <td className="p-3">{msg.email || "N/A"}</td>
                  <td className="p-3 max-w-xs truncate">{msg.message}</td>
                  <td className="p-3">
                    <Badge
                      className={
                        msg.replied
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }
                    >
                      {msg.replied ? "Replied" : "Pending"}
                    </Badge>
                  </td>
                  <td className="p-3">{safeFormatDate(msg.created_at)}</td>
                  <td className="p-3 text-right flex justify-end gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setCurrentMsg(msg)
                            setReply(msg.reply || "")
                            setReplyModalOpen(true)
                          }}
                        >
                          <Reply className="h-4 w-4 mr-1" /> Reply
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Reply to this message</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(msg.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete this message</TooltipContent>
                    </Tooltip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Reply Modal */}
      <Dialog open={replyModalOpen} onOpenChange={setReplyModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reply to {currentMsg?.name}</DialogTitle>
          </DialogHeader>
          <textarea
            className="w-full h-32 p-2 border rounded-md"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          />
          <div className="flex justify-end mt-4">
            <Button onClick={handleReplySubmit}>Send Reply</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
