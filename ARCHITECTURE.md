# HIU CMS Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     Content Editors/Managers                     │
│                    (German/English speaking team)                 │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ Browser (Chrome/Firefox/Safari)
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                  Sanity Studio (Web UI)                          │
│              http://localhost:3333 (local)                       │
│          https://manage.sanity.io (production)                   │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Admin Interface                                           │ │
│  │  ├─ News Article Creator                                  │ │
│  │  ├─ Image Manager (Featured + Gallery)                    │ │
│  │  ├─ Rich Text Editor (English & German)                   │ │
│  │  ├─ Publishing Workflow (Draft → Published → Archived)    │ │
│  │  ├─ Team/Author Management                                │ │
│  │  └─ SEO Fields (Meta titles, descriptions, keywords)      │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Vision Tool (Query Debugger)                              │ │
│  │  └─ Test GROQ queries                                      │ │
│  └────────────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ REST API / GraphQL
                         │
┌────────────────────────▼────────────────────────────────────────┐
│            Sanity Backend (Managed Cloud)                        │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Database                                                  │ │
│  │  └─ News Documents (with EN/DE translations)              │ │
│  │     ├─ IDs, slugs, timestamps                             │ │
│  │     ├─ Titles, summaries, content                         │ │
│  │     ├─ Images (featured + gallery)                        │ │
│  │     ├─ Publish dates, status                              │ │
│  │     └─ Authors, tags, SEO metadata                        │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Asset Storage (CDN)                                       │ │
│  │  └─ Optimized image delivery globally                      │ │
│  │     ├─ Automatic format conversion (WebP, JPG, etc.)      │ │
│  │     ├─ Resizing & cropping                                 │ │
│  │     └─ Caching                                             │ │
│  └────────────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────────┘
                         │
          ┌──────────────┴──────────────┐
          │                             │
          │ GROQ Queries               │ CDN Image URLs
          │ (JSON responses)           │
          │                             │
┌─────────▼────────────────┐ ┌────────▼──────────────────────┐
│  Next.js Application      │ │  Image Optimization           │
│  (Website Frontend)       │ │  ├─ Different sizes           │
│                           │ │  ├─ Responsive formats        │
│  ├─ News Page             │ │  └─ Browser caching           │
│  │  └─ Lists articles     │ │                                │
│  │     ├─ With images     │ │                                │
│  │     ├─ By date         │ │                                │
│  │     └─ Both languages  │ │                                │
│  │                        │ │                                │
│  ├─ Article Pages         │ │                                │
│  │  └─ /news/[slug]       │ │                                │
│  │     ├─ Full content    │ │                                │
│  │     ├─ Gallery view    │ │                                │
│  │     ├─ Author info     │ │                                │
│  │     └─ SEO metadata    │ │                                │
│  │                        │ │                                │
│  ├─ Language Switching    │ │                                │
│  │  └─ EN ↔ DE           │ │                                │
│  │                        │ │                                │
│  └─ Static Generation     │ │                                │
│     (ISR caching)         │ │                                │
└─────────┬────────────────┘ └────────┬──────────────────────┘
          │                             │
          │ HTML/CSS/JS                 │
          └──────────────┬──────────────┘
                         │
                         │ Browser
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                Website Visitors                                  │
│                                                                   │
│  https://www.hi-university.de/en/news                            │
│  ├─ News listing with cards                                      │
│  ├─ Article detail pages                                         │
│  └─ Responsive on all devices                                    │
└────────────────────────────────────────────────────────────────┘
```

---

## Data Flow: Creating to Publishing

```
┌─────────────┐
│   Editor    │
│   Types     │
│  Article    │
└──────┬──────┘
       │ Fills in form
       │ (Title, Content, Images)
       │
┌──────▼─────────────────────┐
│  Sanity Admin Interface     │
│                             │
│  - English text input       │
│  - German text input        │
│  - Image upload             │
│  - Publish date selector    │
│  - Status selector          │
└──────┬─────────────────────┘
       │ Clicks "Publish"
       │
┌──────▼─────────────────────┐
│  Sanity Backend             │
│                             │
│  - Validates all fields     │
│  - Compresses/optimizes img │
│  - Generates image URLs     │
│  - Stores in database       │
└──────┬─────────────────────┘
       │ Document published
       │
┌──────▼─────────────────────┐
│  Next.js ISR Revalidation   │
│                             │
│  - Fetches from API         │
│  - Re-renders page          │
│  - Caches statically        │
│  - Incremental updates      │
└──────┬─────────────────────┘
       │ Page refreshed
       │
┌──────▼─────────────────────┐
│  Website Visitor            │
│  Sees new article           │
│  Within 1-5 minutes         │
└────────────────────────────┘
```

---

## Content Structure (News Article)

```
News Article
├── Metadata
│   ├── _id (internal)
│   ├── _type: "news"
│   ├── slug: "article-slug"
│   └── publishDate: timestamp
│
├── Content (Bilingual)
│   ├── English (en)
│   │   ├── title: "Article Title"
│   │   ├── summary: "Short excerpt"
│   │   └── content: [rich text blocks]
│   │
│   └── German (de)
│       ├── title: "Artikel Titel"
│       ├── summary: "Kurze Beschreibung"
│       └── content: [rich text blocks]
│
├── Media
│   ├── featuredImage
│   │   ├── asset → CDN URL
│   │   ├── alt: { en, de }
│   │   └── caption: string
│   │
│   └── gallery[]
│       ├── asset → CDN URL
│       ├── alt: { en, de }
│       └── caption: string
│
├── Metadata
│   ├── status: "published" | "draft" | "archived"
│   ├── author → reference to author doc
│   ├── tags: ["event", "announcement"]
│   │
│   └── seo
│       ├── metaTitle: { en, de }
│       ├── metaDescription: { en, de }
│       └── keywords: string[]
│
└── Relations
    └── relatedPrograms: [references]
```

---

## Team Access Levels

```
┌─────────────────────────────────────────┐
│  Sanity Project Admin                   │
│  (Full control)                         │
│  ├─ Create/edit articles                │
│  ├─ Manage team members                 │
│  ├─ Configure API tokens                │
│  ├─ Set dataset permissions             │
│  └─ Access analytics/usage              │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Content Editor                         │
│  (Create & edit articles)               │
│  ├─ Create new articles                 │
│  ├─ Edit own & others' articles         │
│  ├─ Upload images                       │
│  ├─ Publish/archive articles            │
│  └─ View all articles                   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Viewer                                 │
│  (Read-only access)                     │
│  ├─ View articles                       │
│  ├─ View comments                       │
│  └─ Cannot edit/publish                 │
└─────────────────────────────────────────┘
```

---

## Language Strategy

```
┌────────────────────┐
│  Single Document   │
│  (One per Article) │
│                    │
│  ├─ English (en)   │
│  │  ├─ Title       │
│  │  ├─ Summary     │
│  │  └─ Content     │
│  │                 │
│  └─ German (de)    │
│     ├─ Title       │
│     ├─ Summary     │
│     └─ Content     │
└────────────────────┘
         │
         │ Query by language
         │
  ┌──────┴──────┐
  │             │
  │ English     │ German
  │ Version     │ Version
  │             │
  ▼             ▼

Website EN   Website DE
(English)    (German)
```

---

## Data Validation Rules

```
Field              Required  Unique  Max Length  Type
─────────────────────────────────────────────────────────
slug               ✓         ✓       -          String
title.en           ✓         -       -          String
title.de           ✓         -       -          String
summary.en         ✓         -       300        Text
summary.de         ✓         -       300        Text
content.en         ✓         -       -          Rich Text
content.de         ✓         -       -          Rich Text
featuredImage      ✓         -       50MB       Image
gallery            -         -       -          Image[]
publishDate        ✓         -       -          DateTime
status             ✓         -       -          Enum
author             -         -       -          Reference
seo.metaTitle      -         -       60         String
seo.metaDesc       -         -       160        Text
tags               -         -       -          String[]
relatedPrograms    -         -       -          Ref[]
```

---

## Caching Strategy

```
Content                 Cache Duration    Refresh Trigger
────────────────────────────────────────────────────────────
Article List (News)    3600 seconds       Every new/edit
Single Article         7200 seconds       On publish
Images (CDN)           86400 seconds      Manual
Static Assets          31536000 seconds   Build time

Revalidation:
- On demand after publish
- Automatic after ISR timeout
- Manual via API
```

---

## File Structure

```
hiu-cms/
├── sanity/
│   ├── schemaTypes/
│   │   ├── index.ts           # Schema exports
│   │   ├── news.ts            # News article (300+ lines)
│   │   └── author.ts          # Author (simple)
│   └── plugins/               # Custom plugins (future)
│
├── sanity.config.ts           # Main config
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
├── .env.local                 # Credentials (secret)
├── .gitignore                 # Git rules
│
└── Documentation/
    ├── README.md              # Project overview
    ├── SETUP_GUIDE.md         # Step-by-step
    ├── SCHEMA.md              # Content model
    ├── NEXT_JS_INTEGRATION.md # Frontend setup
    ├── IMPLEMENTATION_ROADMAP.md
    ├── QUICK_REFERENCE.md
    └── ARCHITECTURE.md        # This file
```

---

## Integration Points

### With Next.js Frontend

```
Next.js App
├── lib/sanity.client.ts          # Sanity connection
├── lib/sanity.image.ts           # Image URL helper
├── app/news/page.tsx             # Listing page
├── app/news/[slug]/page.tsx      # Detail page
└── components/
    ├── NewsCard.tsx              # Article preview
    └── ArticleContent.tsx        # Rich text renderer
```

### With Analytics

```
Sanity → Next.js → Google Analytics
                ↓
            Track article views
            Track engagement
            Monitor performance
```

### With Email/Notifications (Future)

```
Sanity (on publish)
        ↓
    Webhook
        ↓
    Email Service
        ↓
    Send notification to subscribers
```

---

## Performance Optimization

```
Layer                  Optimization
─────────────────────────────────────────
Content Delivery       Sanity CDN
                       ├─ Global distribution
                       ├─ Image optimization
                       └─ Caching headers

Frontend Caching       ISR (Incremental Static Regen)
                       ├─ Pre-render at build
                       ├─ Revalidate on change
                       └─ Serve from edge

Image Optimization     @sanity/image-url
                       ├─ Responsive sizes
                       ├─ Format conversion
                       └─ Lazy loading

Request Optimization   GROQ queries
                       ├─ Request only needed fields
                       ├─ Pagination
                       └─ Filtering at API level
```

---

## Security Architecture

```
Public Access
├─ Read-only access to published articles
├─ API token optional for drafts
└─ CORS configured

Authenticated Access
├─ Sanity Studio login required
├─ 2FA available (recommended)
├─ Session tokens (time-limited)
└─ Audit logs enabled

Data Protection
├─ HTTPS/TLS for all traffic
├─ Database encryption at rest
├─ Regular backups
└─ Compliance (GDPR ready)
```

---

**This architecture is designed to scale:** As you add Programs, Team profiles, and Events, the same Sanity backend handles all content types with the same robust querying and caching mechanisms.
