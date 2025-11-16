"use client"
// ADD AT TOP with other imports
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { AdminHeader } from "@/components/admin/header"
import { DataTable } from "@/components/admin/data-table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { createServerClientInstance } from "@/lib/supabase/server"
import type { CarouselImage } from "@/lib/types/database"

export default function CarouselPage() {
  const [images, setImages] = useState<CarouselImage[]>([])
  const [selectedImage, setSelectedImage] = useState<CarouselImage | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  const [formData, setFormData] = useState({
    image_url: "",
    order_number: 0,
  })

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from("carousel_images")
      .select("*")
      .order("order_number", { ascending: true })

    if (!error && data) {
      setImages(data)
    }
    setIsLoading(false)
  }

  const handleCreate = () => {
    setFormData({
      image_url: "",
      order_number: images.length + 1,
    })
    setIsCreating(true)
  }

  const handleEdit = (image: CarouselImage) => {
    setFormData({
      image_url: image.image_url,
      order_number: image.order_number,
    })
    setSelectedImage(image)
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (isCreating) {
      const { error } = await supabase.from("carousel_images").insert(formData)

      if (!error) {
        fetchImages()
        setIsCreating(false)
      }
    } else if (isEditing && selectedImage) {
      const { error } = await supabase.from("carousel_images").update(formData).eq("id", selectedImage.id)

      if (!error) {
        fetchImages()
        setIsEditing(false)
        setSelectedImage(null)
      }
    }
  }

  const handleDelete = async (image: CarouselImage) => {
    if (confirm("Are you sure you want to delete this carousel image?")) {
      const { error } = await supabase.from("carousel_images").delete().eq("id", image.id)

      if (!error) {
        fetchImages()
      }
    }
  }

  const columns = [
    { key: "order_number", label: "Order" },
    {
      key: "image_url",
      label: "Image",
      render: (value: string) => (
        <img src={value || "/placeholder.svg"} alt="carousel" className="w-16 h-16 object-cover rounded" />
      ),
    },
  ]

  return (
    <>
      <AdminHeader title="Carousel Images" description="Manage homepage carousel images" />

      <div className="p-6">
        <div className="mb-6">
          <Button onClick={handleCreate} className="gap-2">
            <Plus size={18} />
            Add Image
          </Button>
        </div>

        {isLoading ? (
          <p className="text-center text-muted-foreground py-8">Loading carousel images...</p>
        ) : (
          <DataTable
            data={images}
            columns={columns}
            onView={setSelectedImage}
            onDelete={handleDelete}
            searchPlaceholder="Search carousel images..."
          />
        )}
      </div>

      {/* View Dialog */}
      <Dialog open={!!selectedImage && !isEditing} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">Carousel Image</DialogTitle>
            <DialogDescription>Order: {selectedImage?.order_number}</DialogDescription>
          </DialogHeader>

          {selectedImage && (
            <div className="space-y-4">
              <img
                src={selectedImage.image_url || "/placeholder.svg"}
                alt="carousel"
                className="w-full h-64 object-cover rounded-lg"
              />

              <div className="flex gap-2 pt-4 border-t">
                <Button onClick={() => handleEdit(selectedImage)} className="flex-1">
                  Edit Image
                </Button>
                <Button onClick={() => setSelectedImage(null)} variant="outline" className="flex-1">
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create/Edit Dialog */}
      <Dialog
        open={isCreating || isEditing}
        onOpenChange={() => {
          setIsCreating(false)
          setIsEditing(false)
          setSelectedImage(null)
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">
              {isCreating ? "Add Carousel Image" : "Edit Carousel Image"}
            </DialogTitle>
            <DialogDescription>
              {isCreating ? "Add a new image to the homepage carousel" : "Update carousel image"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL *</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="order_number">Display Order *</Label>
              <Input
                id="order_number"
                type="number"
                min="1"
                value={formData.order_number}
                onChange={(e) => setFormData({ ...formData, order_number: Number.parseInt(e.target.value) || 0 })}
              />
            </div>

            {formData.image_url && (
              <img
                src={formData.image_url || "/placeholder.svg"}
                alt="preview"
                className="w-full h-48 object-cover rounded-lg"
              />
            )}

            <div className="flex gap-2 pt-4 border-t">
              <Button onClick={handleSave} className="flex-1">
                {isCreating ? "Add Image" : "Save Changes"}
              </Button>
              <Button
                onClick={() => {
                  setIsCreating(false)
                  setIsEditing(false)
                  setSelectedImage(null)
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
