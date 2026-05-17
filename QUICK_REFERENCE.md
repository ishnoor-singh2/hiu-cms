# Quick Reference Guide

Fast lookup for common tasks.

## 🚀 Getting Started (First Time)

```bash
# 1. Navigate to project
cd /Users/ishnoorsingh/Code/HIU_dev/hiu-cms

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env.local
# Edit .env.local with your Sanity credentials

# 4. Start CMS
npm run dev

# 5. Open browser
# http://localhost:3333
```

---

## 📝 Creating Content

### In CMS Admin (http://localhost:3333)

1. **New Article**
   - Click "News Article" → "Create"
   - Fill in Title (EN + DE)
   - Add Summary (EN + DE)
   - Paste/type Content (EN + DE)
   - Upload Featured Image
   - Set Publish Date
   - Change Status to "Published"
   - Click "Publish"

2. **Edit Article**
   - Find in list
   - Click to open
   - Make changes
   - Click "Publish"

3. **Archive Article**
   - Open article
   - Change status to "Archived"
   - Click "Publish"

---

## 💻 Common Development Tasks

### Fetch Articles in Next.js

```typescript
import { client } from '@/lib/sanity.client'

// Get all articles
const articles = await client.fetch(`
  *[_type == "news" && status == "published"] 
  | order(publishDate desc)
`)

// Get single article
const article = await client.fetch(`
  *[_type == "news" && slug.current == $slug][0]
`, { slug: 'my-article-slug' })
```

### Display Article

```tsx
import Image from 'next/image'
import { urlFor } from '@/lib/sanity.image'

export default function Article({ article }) {
  return (
    <article>
      <h1>{article.title.en}</h1>
      <img 
        src={urlFor(article.featuredImage).width(800).url()}
        alt={article.featuredImage.alt.en}
      />
      <p>{article.summary.en}</p>
      {/* Render content with Portable Text */}
    </article>
  )
}
```

### Query Multiple Languages

```groq
*[_type == "news"] {
  title { en, de },
  summary { en, de },
  content { en, de }
}
```

---

## 🛠️ Useful Commands

```bash
# Development
npm run dev              # Start CMS

# Production
npm run build            # Build project
npm run deploy           # Deploy to Sanity

# Data Management
npm run export           # Backup all data
npm run import           # Restore from backup

# Debugging
npm run dev -- --no-cache  # Clear cache
npm run dev -- --host 0.0.0.0  # Expose to network
```

---

## 📊 GROQ Query Examples

### Get Latest 5 Articles
```groq
*[_type == "news" && status == "published"] 
| order(publishDate desc)[0..4]
```

### Get by Tag
```groq
*[_type == "news" && "event" in tags]
```

### Get with Author
```groq
*[_type == "news"] {
  ...,
  author->{
    name,
    email
  }
}
```

### Get with Images
```groq
*[_type == "news"] {
  ...,
  featuredImage {
    asset->{url},
    alt
  },
  gallery[] {
    asset->{url},
    alt
  }
}
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| CMS won't start | Check `.env.local` has correct credentials |
| Images won't upload | Check file size, format, internet connection |
| Articles not appearing | Verify status is "published", not "draft" |
| Permission error | Check API token permissions are "Editor" |
| Blank admin panel | Clear cache (Cmd+Shift+Delete), logout/login |

---

## 🔐 Environment Variables

```
# Required
SANITY_STUDIO_PROJECT_ID=your-project-id
SANITY_STUDIO_DATASET=production

# Optional (for preview mode)
SANITY_API_TOKEN=your-api-token
```

Get these from: https://manage.sanity.io → Your Project → Settings

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Project overview |
| `SETUP_GUIDE.md` | Step-by-step setup |
| `SCHEMA.md` | Content model details |
| `NEXT_JS_INTEGRATION.md` | Frontend integration |
| `IMPLEMENTATION_ROADMAP.md` | Timeline & milestones |

---

## 🔗 Useful Links

- **Sanity Dashboard:** https://manage.sanity.io
- **Sanity Docs:** https://www.sanity.io/docs
- **GROQ Reference:** https://www.sanity.io/docs/groq
- **Next.js Docs:** https://nextjs.org/docs
- **Local CMS:** http://localhost:3333

---

## 📞 Common Contacts

| Role | Responsibility |
|------|-----------------|
| CMS Admin | Sanity setup, team access, backups |
| Content Editor | Creating/editing articles |
| Developer | Schema updates, Next.js integration |
| DevOps | Deployment, monitoring, security |

---

## 🎯 Checklist: After Setup

- [ ] Created Sanity account
- [ ] Saved Project ID and API token
- [ ] Updated `.env.local`
- [ ] Ran `npm install`
- [ ] Started CMS with `npm run dev`
- [ ] Accessed http://localhost:3333
- [ ] Created first test article
- [ ] Verified article appears on website
- [ ] Added team members
- [ ] Exported first backup

---

## 💡 Tips & Tricks

**Add Formatting to Content:**
- Highlight text → click B for bold, I for italic
- Select text → click quote button for blockquote
- Click bullet list button for lists

**SEO Best Practices:**
- Meta title: 50-60 characters
- Meta description: 150-160 characters
- Always add image alt text
- Use 5-10 relevant keywords

**Performance:**
- Keep featured image under 500KB
- Use JPG for photos, PNG for graphics
- Add image alt text (required for SEO)
- Set appropriate publish dates (schedule content)

**Organization:**
- Use consistent tags
- Archive old articles (don't delete)
- Fill in author field
- Add related programs when relevant

---

## 🆘 When Things Go Wrong

### CMS Won't Start
```bash
# Try clearing everything
rm -rf node_modules
npm install
npm run dev
```

### Can't Connect to Sanity
```bash
# Check credentials in .env.local
cat .env.local

# Verify Project ID
# Visit https://manage.sanity.io and confirm
```

### Articles Not Showing on Website
```bash
# Check article status is "published"
# Use Vision tab in CMS to test GROQ query
# Verify Next.js has correct Project ID
```

### Images Won't Load
```bash
# Check alt text is filled in
# Verify image isn't corrupted
# Check asset references in Vision tab
```

---

## 🚀 You're All Set!

Next steps:
1. Follow SETUP_GUIDE.md
2. Create first article
3. Test integration
4. Train team
5. Go live!

**Need help?** Check the relevant documentation file or visit Sanity docs.
