export interface Admin {
  id: string
  name: string
  email: string
  role: "superadmin" | "admin"
  created_at: string
  updated_at: string
}

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  author: string
  date: string
  read_time: string
  image?: string
  status: "draft" | "published"
  views: number
  created_at: string
  updated_at: string
}

export interface Donation {
  id: string
  donor_name: string
  amount: number
  date: string
  method: "mpesa" | "paypal" | "bank_transfer"
  message?: string
  created_at: string
}

export interface Message {
  id: string
  name: string
  email: string
  subject: string
  message: string
  replied: boolean
  reply_text?: string
  created_at: string
  updated_at: string
}

export interface Partner {
  id: string
  name: string
  logo_url?: string
  website?: string
  contact?: string
  description?: string
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  title: string
  description: string
  full_description?: string
  category: string
  status: 'active' | 'completed' | 'paused' | 'planned'
  progress: number
  location?: string
  beneficiaries: number
  start_date: string
  end_date?: string
  image_url?: string
  objectives: string[]
  outcomes?: string[]
  views: number
  date: string
  created_at: string
  updated_at: string
}

export interface Testimonial {
  id: string
  name: string
  message: string
  role?: string
  avatar_url?: string
  approved: boolean
  created_at: string
  updated_at: string
}

export interface Volunteer {
  id: string
  name: string
  email: string
  phone?: string
  availability?: string
  interests?: string
  experience?: string
  status?: "pending" | "approved" | "rejected"
  created_at: string
}

export interface CarouselImage {
  id: string
  image_url: string
  order_number: number
  created_at: string
  updated_at: string
}