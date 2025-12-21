import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://karungussv.vercel.app"
  const now = new Date()

  return [
    // Home
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },

    // Main pages
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/programs`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/projects`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: `${baseUrl}/donate`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: `${baseUrl}/get-involved`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },

    // Get Involved subpages
    { url: `${baseUrl}/get-involved/volunteer`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${baseUrl}/get-involved/become-member`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${baseUrl}/get-involved/partner`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },

    // Blog overview
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.8 },

    // Blog posts with featured images
    {
      url: `${baseUrl}/blog/survivor-dignity-and-empowerment`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
      images: [{ url: `${baseUrl}/blog-images/survivor-dignity.jpg`, caption: "Survivor Dignity and Empowerment" }],
    },
    {
      url: `${baseUrl}/blog/why-volunteer-and-donation-engagement-matters-for-community-change`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
      images: [{ url: `${baseUrl}/blog-images/volunteer-donation.jpg`, caption: "Volunteer & Donation Engagement" }],
    },
    {
      url: `${baseUrl}/blog/myths-and-facts-about-sexual-violence-in-rural-kenya`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
      images: [{ url: `${baseUrl}/blog-images/myths-facts-sexual-violence.jpg`, caption: "Myths and Facts About Sexual Violence" }],
    },
    {
      url: `${baseUrl}/blog/gbv-gender-based-violence-what-it-is-and-why-we-must-talk-about-it`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
      images: [{ url: `${baseUrl}/blog-images/gbv-explained.jpg`, caption: "Gender-Based Violence Explained" }],
    },
    {
      url: `${baseUrl}/blog/mental-health-in-kenya-understanding-support-and-hope`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
      images: [{ url: `${baseUrl}/blog-images/mental-health-kenya.jpg`, caption: "Mental Health in Kenya" }],
    },
    {
      url: `${baseUrl}/blog/healing-and-justice-supporting-survivors-of-sexual-violence-in-karungu`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
      images: [{ url: `${baseUrl}/blog-images/healing-justice-karungu.jpg`, caption: "Healing and Justice" }],
    },
    {
      url: `${baseUrl}/blog/from-survivor-to-entrepreneur-marys-journey`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
      images: [{ url: `${baseUrl}/blog-images/marys-journey.jpg`, caption: "Mary's Journey" }],
    },
    {
      url: `${baseUrl}/blog/community-dialogues-bring-positive-change`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
      images: [{ url: `${baseUrl}/blog-images/community-dialogues.jpg`, caption: "Community Dialogues" }],
    },

    // Policy pages
    { url: `${baseUrl}/privacy-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${baseUrl}/terms-of-service`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
  ]
}
