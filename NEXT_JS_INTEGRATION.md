# Next.js Integration Guide

Connect your Next.js website to the Sanity CMS to display news articles.

## Setup

### 1. Install Dependencies

```bash
npm install sanity next-sanity @sanity/image-url
```

### 2. Create Sanity Client

Create `lib/sanity.client.ts` in your Next.js project:

```typescript
import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

export const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: true,
  token: process.env.SANITY_API_TOKEN,
})

export const config = {
  projectId,
  dataset,
}
```

### 3. Add Environment Variables

In your `.env.local`:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-api-token  # Optional, for preview mode
```

### 4. Create Image URL Helper

Create `lib/sanity.image.ts`:

```typescript
import ImageUrlBuilder from '@sanity/image-url'
import { config } from './sanity.client'

const builder = ImageUrlBuilder(config)

export function urlFor(source: any) {
  return builder.image(source)
}
```

---

## GROQ Queries

### Fetch All News Articles

```groq
*[_type == "news" && status == "published"] | order(publishDate desc) {
  _id,
  slug,
  title,
  summary,
  featuredImage {
    asset->{
      _id,
      url
    },
    alt
  },
  publishDate,
  author->{
    name
  }
}
```

### Fetch Single Article by Slug

```groq
*[_type == "news" && slug.current == $slug][0] {
  _id,
  slug,
  title,
  summary,
  content,
  featuredImage {
    asset->{
      _id,
      url
    },
    alt,
    caption
  },
  gallery[] {
    asset->{
      _id,
      url
    },
    alt,
    caption
  },
  publishDate,
  author->{
    name,
    email,
    image {
      asset->{
        url
      }
    },
    bio
  },
  seo,
  tags
}
```

### Fetch News for Homepage

```groq
*[_type == "news" && status == "published"] | order(publishDate desc)[0..5] {
  slug,
  title,
  summary,
  publishDate,
  featuredImage {
    asset->{
      url
    },
    alt
  }
}
```

### Fetch by Language

```groq
*[_type == "news" && status == "published"] | order(publishDate desc) {
  slug,
  title { en, de },
  summary { en, de },
  publishDate
}
```

---

## Example: News Page Component

### Fetch News Articles

`app/news/page.tsx` (App Router):

```typescript
import { client } from '@/lib/sanity.client'
import NewsCard from '@/components/NewsCard'

async function getNews() {
  const query = `
    *[_type == "news" && status == "published"] | order(publishDate desc) {
      _id,
      slug,
      title,
      summary,
      publishDate,
      featuredImage {
        asset->{
          url
        },
        alt
      }
    }
  `

  const news = await client.fetch(query)
  return news
}

export default async function NewsPage() {
  const news = await getNews()

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">News & Updates</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {news.map((article: any) => (
          <NewsCard key={article._id} article={article} />
        ))}
      </div>
    </div>
  )
}
```

### News Card Component

`components/NewsCard.tsx`:

```typescript
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity.image'

export default function NewsCard({ article }: { article: any }) {
  const publishDate = new Date(article.publishDate).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  const imageUrl = urlFor(article.featuredImage).width(400).height(250).url()

  return (
    <Link href={`/news/${article.slug.current}`}>
      <div className="border rounded-lg overflow-hidden hover:shadow-lg transition">
        <div className="relative w-full h-48">
          <Image
            src={imageUrl}
            alt={article.featuredImage.alt.en}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-500 mb-2">{publishDate}</p>
          <h2 className="text-xl font-bold mb-2">{article.title.en}</h2>
          <p className="text-gray-600">{article.summary.en}</p>
          <p className="text-blue-600 mt-4 font-semibold">Read More →</p>
        </div>
      </div>
    </Link>
  )
}
```

---

## Example: Single Article Page

### Dynamic Route

`app/news/[slug]/page.tsx`:

```typescript
import { client } from '@/lib/sanity.client'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity.image'
import { PortableText } from '@portabletext/react'

async function getArticle(slug: string) {
  const query = `
    *[_type == "news" && slug.current == $slug][0] {
      _id,
      title,
      summary,
      content,
      featuredImage {
        asset->{
          url
        },
        alt
      },
      gallery[] {
        asset->{
          url
        },
        alt,
        caption
      },
      publishDate,
      author->{
        name
      }
    }
  `

  return await client.fetch(query, { slug })
}

export async function generateMetadata({ params }: any) {
  const article = await getArticle(params.slug)

  return {
    title: article.title.en,
    description: article.summary.en,
    openGraph: {
      title: article.title.en,
      description: article.summary.en,
      images: [urlFor(article.featuredImage).width(1200).height(630).url()],
    },
  }
}

export default async function ArticlePage({ params }: any) {
  const article = await getArticle(params.slug)

  const publishDate = new Date(article.publishDate).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <article className="container mx-auto px-4 py-12 max-w-3xl">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{article.title.en}</h1>
        <div className="flex items-center justify-between text-gray-600 mb-8">
          <span>{publishDate}</span>
          {article.author && <span>{article.author.name}</span>}
        </div>
      </header>

      {/* Featured Image */}
      <div className="relative w-full h-96 mb-8">
        <Image
          src={urlFor(article.featuredImage).width(800).url()}
          alt={article.featuredImage.alt.en}
          fill
          className="object-cover rounded-lg"
        />
      </div>

      {/* Content */}
      <div className="prose max-w-none mb-12">
        <PortableText value={article.content.en} />
      </div>

      {/* Gallery */}
      {article.gallery && article.gallery.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {article.gallery.map((image: any, idx: number) => (
              <div key={idx} className="relative w-full h-64">
                <Image
                  src={urlFor(image).width(600).url()}
                  alt={image.alt.en}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  )
}
```

---

## Dynamic Routes (Static Generation)

Generate static pages for all articles:

```typescript
// app/news/[slug]/page.tsx

export async function generateStaticParams() {
  const query = `*[_type == "news"]{slug}`
  const slugs = await client.fetch(query)
  
  return slugs.map((doc: any) => ({
    slug: doc.slug.current,
  }))
}
```

---

## Multilingual Support

### Query by Language

```typescript
// Fetch for specific language
const getNewsByLanguage = async (language: 'en' | 'de') => {
  const query = `
    *[_type == "news" && status == "published"] | order(publishDate desc) {
      slug,
      title { ${language} },
      summary { ${language} },
      content { ${language} },
      publishDate
    }
  `
  
  return await client.fetch(query)
}
```

### Language Context Provider

```typescript
'use client'

import { createContext, useContext, useState } from 'react'

type Language = 'en' | 'de'

const LanguageContext = createContext<{
  language: Language
  setLanguage: (lang: Language) => void
}>({ language: 'en', setLanguage: () => {} })

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
```

---

## Incremental Static Regeneration (ISR)

Revalidate cached pages periodically:

```typescript
// app/news/page.tsx

export const revalidate = 60 // Revalidate every 60 seconds

async function getNews() {
  const query = `*[_type == "news" && status == "published"]`
  return await client.fetch(query)
}
```

For individual articles:

```typescript
// app/news/[slug]/page.tsx

export const revalidate = 3600 // Revalidate every hour

async function getArticle(slug: string) {
  // ... fetch logic
}
```

---

## Preview Mode

Allow draft content preview:

```typescript
// app/api/preview/route.ts

import { client } from '@/lib/sanity.client'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')

  const article = await client.fetch(
    `*[_type == "news" && slug.current == $slug][0]`,
    { slug },
    {
      token: process.env.SANITY_API_TOKEN, // Use token for drafts
    }
  )

  if (!article) {
    return new Response('Article not found', { status: 404 })
  }

  const response = new Response(
    `Redirecting to ${slug}...`
  )
  
  response.headers.set('Set-Cookie', `__preview=true`)
  response.headers.set('Location', `/news/${slug}`)
  
  return response
}
```

---

## Common Issues

### Images Not Loading

Check that image assets are properly published in Sanity and CDN is enabled.

### CORS Issues

Ensure your Next.js domain is whitelisted in Sanity project settings.

### Stale Data

Use `revalidate` in Server Components or set proper Cache-Control headers.

### Preview Mode Not Working

Verify `SANITY_API_TOKEN` is set and token has correct permissions.

---

## Useful Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity Next.js Integration](https://www.sanity.io/docs/next-js)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
- [Portable Text](https://www.sanity.io/docs/structured-content)
