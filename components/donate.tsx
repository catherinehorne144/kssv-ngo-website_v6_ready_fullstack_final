"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Smartphone, CreditCard, Heart, Shield, Users, CheckCircle2 } from "lucide-react"
import { useScrollReveal } from "@/lib/scroll-reveal"

export function Donate() {
  useScrollReveal()
  const [isMpesaModalOpen, setIsMpesaModalOpen] = useState(false)
  const [isPayPalModalOpen, setIsPayPalModalOpen] = useState(false)
  const [donationAmount, setDonationAmount] = useState("")
  const [customAmount, setCustomAmount] = useState("")
  const [donorInfo, setDonorInfo] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const presetAmounts = ["500", "1000", "2500", "5000", "10000"]

  const impactAreas = [
    {
      icon: Shield,
      title: "Legal Aid",
      description: "KES 5,000 provides legal representation for one survivor",
    },
    {
      icon: Heart,
      title: "Counseling",
      description: "KES 2,500 covers 5 counseling sessions",
    },
    {
      icon: Users,
      title: "Economic Empowerment",
      description: "KES 10,000 supports a VSLA group for 3 months",
    },
  ]

  const handleMpesaDonation = async () => {
    setIsProcessing(true)

    // TODO: Integrate with MPesa API
    // Example MPesa STK Push integration:
    /*
    const response = await fetch('/api/mpesa/stkpush', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phoneNumber: donorInfo.phone,
        amount: donationAmount === 'custom' ? customAmount : donationAmount,
        accountReference: 'KSSV-DONATION',
        transactionDesc: 'Donation to KSSV'
      })
    })
    
    // Handle MPesa callback
    // You'll need to set up a callback URL endpoint to receive payment confirmation
    */

    console.log("[v0] MPesa donation initiated:", {
      amount: donationAmount === "custom" ? customAmount : donationAmount,
      donor: donorInfo,
    })

    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false)
      setIsSuccess(true)
      setTimeout(() => {
        setIsMpesaModalOpen(false)
        setIsSuccess(false)
        setDonationAmount("")
        setCustomAmount("")
        setDonorInfo({ name: "", email: "", phone: "" })
      }, 2000)
    }, 2000)
  }

  const handlePayPalDonation = () => {
    // TODO: Integrate with PayPal
    // Example PayPal integration:
    /*
    // Option 1: Redirect to PayPal hosted page
    window.location.href = `https://www.paypal.com/donate?hosted_button_id=YOUR_BUTTON_ID&amount=${donationAmount === 'custom' ? customAmount : donationAmount}`
    
    // Option 2: Use PayPal JavaScript SDK
    // Load PayPal SDK and create payment button
    // See: https://developer.paypal.com/sdk/js/
    */

    console.log("[v0] PayPal donation initiated:", {
      amount: donationAmount === "custom" ? customAmount : donationAmount,
      donor: donorInfo,
    })

    alert(
      "PayPal integration: In production, this would redirect to PayPal or open PayPal payment modal. Add your PayPal business account details to enable live donations.",
    )
  }

  return (
    <>
      <section id="donate" className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Section Header */}
          <div className="max-w-3xl mx-auto text-center mb-16 reveal">
            <span className="text-primary font-accent text-sm font-semibold tracking-wider uppercase">
              Support Our Work
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6 text-balance">
              Your Donation Changes Lives
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
              Every contribution helps us provide critical support to survivors, pursue justice, and build a safer
              community for all.
            </p>
          </div>

          {/* Impact Areas */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {impactAreas.map((area, index) => (
              <Card key={area.title} className="p-6 text-center reveal" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <area.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-3">{area.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{area.description}</p>
              </Card>
            ))}
          </div>

          {/* Donation Methods */}
          <div className="max-w-4xl mx-auto reveal">
            <Card className="p-8 lg:p-12">
              <h3 className="font-serif text-2xl font-bold text-foreground text-center mb-8">Choose Payment Method</h3>

              <div className="grid md:grid-cols-2 gap-6">
                {/* MPesa */}
                <Card className="p-6 border-2 hover:border-primary transition-colors cursor-pointer group">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Smartphone className="w-8 h-8 text-primary" />
                    </div>
                    <h4 className="font-serif text-xl font-bold text-foreground mb-2">MPesa</h4>
                    <p className="text-sm text-muted-foreground mb-6">Donate securely using MPesa mobile money</p>
                    <Button
                      onClick={() => setIsMpesaModalOpen(true)}
                      className="w-full font-accent font-semibold bg-primary hover:bg-primary/90"
                    >
                      Donate via MPesa
                    </Button>
                  </div>
                </Card>

                {/* PayPal */}
                <Card className="p-6 border-2 hover:border-secondary transition-colors cursor-pointer group">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                      <CreditCard className="w-8 h-8 text-secondary" />
                    </div>
                    <h4 className="font-serif text-xl font-bold text-foreground mb-2">PayPal / Card</h4>
                    <p className="text-sm text-muted-foreground mb-6">Donate using PayPal or credit/debit card</p>
                    <Button
                      onClick={() => setIsPayPalModalOpen(true)}
                      className="w-full font-accent font-semibold bg-secondary hover:bg-secondary/90"
                    >
                      Donate via PayPal
                    </Button>
                  </div>
                </Card>
              </div>

              <div className="mt-8 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground text-center">
                  All donations are secure and tax-deductible. You'll receive a receipt via email.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* MPesa Donation Modal */}
      <Dialog open={isMpesaModalOpen} onOpenChange={setIsMpesaModalOpen}>
        <DialogContent className="max-w-2xl">
          {isSuccess ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-16 h-16 text-secondary mx-auto mb-4" />
              <h3 className="font-serif text-2xl font-bold text-foreground mb-2">Thank You!</h3>
              <p className="text-muted-foreground">Your donation has been received. You'll get a confirmation SMS.</p>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="font-serif text-2xl font-bold">Donate via MPesa</DialogTitle>
                <DialogDescription className="text-base leading-relaxed">
                  Choose an amount and complete your donation securely through MPesa.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Amount Selection */}
                <div className="space-y-3">
                  <Label>Select Amount (KES)</Label>
                  <RadioGroup value={donationAmount} onValueChange={setDonationAmount}>
                    <div className="grid grid-cols-3 gap-3">
                      {presetAmounts.map((amount) => (
                        <div key={amount}>
                          <RadioGroupItem value={amount} id={`mpesa-${amount}`} className="peer sr-only" />
                          <Label
                            htmlFor={`mpesa-${amount}`}
                            className="flex items-center justify-center rounded-lg border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all"
                          >
                            <span className="font-semibold">KES {amount}</span>
                          </Label>
                        </div>
                      ))}
                      <div>
                        <RadioGroupItem value="custom" id="mpesa-custom" className="peer sr-only" />
                        <Label
                          htmlFor="mpesa-custom"
                          className="flex items-center justify-center rounded-lg border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all"
                        >
                          <span className="font-semibold">Custom</span>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>

                  {donationAmount === "custom" && (
                    <Input
                      type="number"
                      placeholder="Enter custom amount"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      min="100"
                    />
                  )}
                </div>

                {/* Donor Information */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="mpesa-name">Full Name *</Label>
                    <Input
                      id="mpesa-name"
                      value={donorInfo.name}
                      onChange={(e) => setDonorInfo({ ...donorInfo, name: e.target.value })}
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mpesa-phone">MPesa Phone Number *</Label>
                    <Input
                      id="mpesa-phone"
                      type="tel"
                      value={donorInfo.phone}
                      onChange={(e) => setDonorInfo({ ...donorInfo, phone: e.target.value })}
                      placeholder="254700000000"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter your MPesa number (format: 254XXXXXXXXX). You'll receive an STK push prompt.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mpesa-email">Email (for receipt)</Label>
                    <Input
                      id="mpesa-email"
                      type="email"
                      value={donorInfo.email}
                      onChange={(e) => setDonorInfo({ ...donorInfo, email: e.target.value })}
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleMpesaDonation}
                    disabled={
                      !donationAmount ||
                      (donationAmount === "custom" && !customAmount) ||
                      !donorInfo.name ||
                      !donorInfo.phone ||
                      isProcessing
                    }
                    className="flex-1 font-accent font-semibold"
                  >
                    {isProcessing ? "Processing..." : "Complete Donation"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsMpesaModalOpen(false)}
                    disabled={isProcessing}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  By donating, you agree to receive a receipt and occasional updates from KSSV.
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* PayPal Donation Modal */}
      <Dialog open={isPayPalModalOpen} onOpenChange={setIsPayPalModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl font-bold">Donate via PayPal</DialogTitle>
            <DialogDescription className="text-base leading-relaxed">
              Choose an amount and you'll be redirected to PayPal to complete your secure donation.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Amount Selection */}
            <div className="space-y-3">
              <Label>Select Amount (USD)</Label>
              <RadioGroup value={donationAmount} onValueChange={setDonationAmount}>
                <div className="grid grid-cols-3 gap-3">
                  {["10", "25", "50", "100", "250"].map((amount) => (
                    <div key={amount}>
                      <RadioGroupItem value={amount} id={`paypal-${amount}`} className="peer sr-only" />
                      <Label
                        htmlFor={`paypal-${amount}`}
                        className="flex items-center justify-center rounded-lg border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-secondary peer-data-[state=checked]:bg-secondary/10 cursor-pointer transition-all"
                      >
                        <span className="font-semibold">${amount}</span>
                      </Label>
                    </div>
                  ))}
                  <div>
                    <RadioGroupItem value="custom" id="paypal-custom" className="peer sr-only" />
                    <Label
                      htmlFor="paypal-custom"
                      className="flex items-center justify-center rounded-lg border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-secondary peer-data-[state=checked]:bg-secondary/10 cursor-pointer transition-all"
                    >
                      <span className="font-semibold">Custom</span>
                    </Label>
                  </div>
                </div>
              </RadioGroup>

              {donationAmount === "custom" && (
                <Input
                  type="number"
                  placeholder="Enter custom amount (USD)"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  min="5"
                />
              )}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handlePayPalDonation}
                disabled={!donationAmount || (donationAmount === "custom" && !customAmount)}
                className="flex-1 font-accent font-semibold bg-secondary hover:bg-secondary/90"
              >
                Continue to PayPal
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsPayPalModalOpen(false)} className="flex-1">
                Cancel
              </Button>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground text-center">
                You'll be redirected to PayPal's secure payment page. PayPal accepts credit cards, debit cards, and
                PayPal balance.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
