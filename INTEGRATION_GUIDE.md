# Backend Integration Guide

This guide explains how to connect the KSSV website forms and features to various backend services.

## Table of Contents

1. [Form Submissions](#form-submissions)
2. [Payment Integration](#payment-integration)
3. [Email Notifications](#email-notifications)
4. [Analytics](#analytics)

---

## Form Submissions

The website includes several forms that need backend integration:
- Contact form
- Membership application
- Volunteer application
- Partnership inquiry
- Testimonial submission

### Option 1: Airtable

**Best for**: Easy setup, visual interface, no coding required

#### Setup Steps:

1. **Create Airtable Base**
   - Go to [airtable.com](https://airtable.com)
   - Create a new base called "KSSV Forms"
   - Create tables: Contacts, Memberships, Volunteers, Partnerships, Testimonials

2. **Get API Credentials**
   - Go to [airtable.com/account](https://airtable.com/account)
   - Generate an API key
   - Find your Base ID in the API documentation

3. **Update Code**

In each form component, replace the TODO comment with:

\`\`\`typescript
const response = await fetch(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Contacts`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    fields: {
      Name: formData.name,
      Email: formData.email,
      Phone: formData.phone,
      Message: formData.message,
      SubmittedAt: new Date().toISOString()
    }
  })
})

if (response.ok) {
  // Success handling
} else {
  // Error handling
}
\`\`\`

4. **Add Environment Variables**

\`\`\`env
AIRTABLE_API_KEY=your_api_key_here
AIRTABLE_BASE_ID=your_base_id_here
\`\`\`

**Security Note**: Create an API route to keep credentials secure:

\`\`\`typescript
// app/api/submit-form/route.ts
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const data = await request.json()
  
  const response = await fetch(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Contacts`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ fields: data })
  })
  
  return NextResponse.json(await response.json())
}
\`\`\`

### Option 2: Google Sheets + SheetDB

**Best for**: Free, familiar interface, easy data export

#### Setup Steps:

1. **Create Google Sheet**
   - Create a new Google Sheet
   - Add column headers: Name, Email, Phone, Message, Timestamp

2. **Connect to SheetDB**
   - Go to [sheetdb.io](https://sheetdb.io)
   - Create free account
   - Connect your Google Sheet
   - Get your API endpoint

3. **Update Code**

\`\`\`typescript
const response = await fetch('https://sheetdb.io/api/v1/YOUR_SHEET_ID', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    data: [{
      Name: formData.name,
      Email: formData.email,
      Phone: formData.phone,
      Message: formData.message,
      Timestamp: new Date().toISOString()
    }]
  })
})
\`\`\`

### Option 3: Firebase Firestore

**Best for**: Real-time updates, scalability, Google ecosystem

#### Setup Steps:

1. **Create Firebase Project**
   - Go to [firebase.google.com](https://firebase.google.com)
   - Create new project
   - Enable Firestore Database

2. **Install Firebase SDK**

\`\`\`bash
npm install firebase
\`\`\`

3. **Initialize Firebase**

\`\`\`typescript
// lib/firebase.ts
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  // ... other config
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
\`\`\`

4. **Update Form Code**

\`\`\`typescript
import { collection, addDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

const docRef = await addDoc(collection(db, 'contacts'), {
  name: formData.name,
  email: formData.email,
  phone: formData.phone,
  message: formData.message,
  submittedAt: new Date().toISOString()
})
\`\`\`

### Option 4: Formspree

**Best for**: Quickest setup, email notifications included

#### Setup Steps:

1. **Create Formspree Account**
   - Go to [formspree.io](https://formspree.io)
   - Create free account
   - Create a new form

2. **Update Code**

\`\`\`typescript
const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(formData)
})
\`\`\`

---

## Payment Integration

### MPesa Integration

**For**: Kenyan mobile money donations

#### Prerequisites:
- Safaricom Daraja API account
- Business Till/Paybill number
- Consumer Key and Consumer Secret

#### Setup Steps:

1. **Register for Daraja API**
   - Go to [developer.safaricom.co.ke](https://developer.safaricom.co.ke)
   - Create account and app
   - Get credentials from dashboard

2. **Create API Route for STK Push**

\`\`\`typescript
// app/api/mpesa/stkpush/route.ts
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { phoneNumber, amount } = await request.json()
  
  // Get access token
  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString('base64')
  
  const tokenResponse = await fetch(
    'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    {
      headers: {
        'Authorization': `Basic ${auth}`
      }
    }
  )
  
  const { access_token } = await tokenResponse.json()
  
  // Initiate STK Push
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3)
  const password = Buffer.from(
    `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
  ).toString('base64')
  
  const stkResponse = await fetch(
    'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: phoneNumber,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: phoneNumber,
        CallBackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/mpesa/callback`,
        AccountReference: 'KSSV-DONATION',
        TransactionDesc: 'Donation to KSSV'
      })
    }
  )
  
  return NextResponse.json(await stkResponse.json())
}
\`\`\`

3. **Create Callback Handler**

\`\`\`typescript
// app/api/mpesa/callback/route.ts
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const data = await request.json()
  
  // Process callback data
  // Store transaction in database
  // Send confirmation email
  
  return NextResponse.json({ ResultCode: 0, ResultDesc: 'Success' })
}
\`\`\`

4. **Environment Variables**

\`\`\`env
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_PASSKEY=your_passkey
MPESA_SHORTCODE=your_shortcode
NEXT_PUBLIC_BASE_URL=https://kssv.org
\`\`\`

### PayPal Integration

**For**: International credit/debit card donations

#### Option A: PayPal Hosted Button (Easiest)

1. **Create Button**
   - Log in to PayPal Business account
   - Go to Tools → PayPal Buttons
   - Create Donate button
   - Get button code

2. **Update Component**

\`\`\`typescript
const handlePayPalDonation = () => {
  window.location.href = `https://www.paypal.com/donate?hosted_button_id=YOUR_BUTTON_ID&amount=${amount}`
}
\`\`\`

#### Option B: PayPal JavaScript SDK (More Control)

1. **Add PayPal Script**

\`\`\`typescript
// app/layout.tsx
<Script
  src={`https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD`}
  strategy="lazyOnload"
/>
\`\`\`

2. **Create PayPal Button Component**

\`\`\`typescript
'use client'

import { useEffect, useRef } from 'react'

export function PayPalButton({ amount }: { amount: number }) {
  const paypalRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (window.paypal && paypalRef.current) {
      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: amount.toString()
              }
            }]
          })
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture()
          // Handle successful payment
          console.log('Payment successful:', order)
        }
      }).render(paypalRef.current)
    }
  }, [amount])
  
  return <div ref={paypalRef} />
}
\`\`\`

---

## Email Notifications

### Option 1: SendGrid

1. **Setup**
   - Create account at [sendgrid.com](https://sendgrid.com)
   - Verify sender email
   - Get API key

2. **Install SDK**

\`\`\`bash
npm install @sendgrid/mail
\`\`\`

3. **Create Email Function**

\`\`\`typescript
// lib/email.ts
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export async function sendEmail(to: string, subject: string, html: string) {
  await sgMail.send({
    to,
    from: 'info@kssv.org',
    subject,
    html
  })
}
\`\`\`

### Option 2: Resend

1. **Setup**
   - Create account at [resend.com](https://resend.com)
   - Get API key

2. **Install SDK**

\`\`\`bash
npm install resend
\`\`\`

3. **Send Email**

\`\`\`typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

await resend.emails.send({
  from: 'info@kssv.org',
  to: 'recipient@example.com',
  subject: 'Thank you for your donation',
  html: '<p>Your donation has been received...</p>'
})
\`\`\`

---

## Analytics

### Google Analytics 4

1. **Create GA4 Property**
   - Go to [analytics.google.com](https://analytics.google.com)
   - Create new property
   - Get Measurement ID

2. **Add to Layout**

\`\`\`typescript
// app/layout.tsx
import Script from 'next/script'

<Script
  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
  `}
</Script>
\`\`\`

---

## Testing

Before going live, test all integrations:

1. **Forms**: Submit test data and verify it appears in your backend
2. **Payments**: Use sandbox/test mode for MPesa and PayPal
3. **Emails**: Send test emails to verify delivery
4. **Analytics**: Check real-time reports in GA4

---

## Security Best Practices

1. **Never expose API keys in client-side code**
2. **Use environment variables for all credentials**
3. **Create API routes for sensitive operations**
4. **Implement rate limiting on forms**
5. **Validate and sanitize all user inputs**
6. **Use HTTPS in production**
7. **Keep dependencies updated**

---

For questions or issues, refer to the main README.md or contact the development team.
