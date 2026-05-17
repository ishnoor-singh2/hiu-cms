# Sanity CMS - Complete Setup Guide

Step-by-step instructions to get the HIU CMS running.

## Phase 1: Create Sanity Project

### Step 1: Create Account
1. Go to https://sanity.io
2. Click "Sign up"
3. Create account with email/Google/GitHub

### Step 2: Create Project
1. After login, click "Create new project"
2. Fill in project details:
   - **Project name:** `HIU CMS` or `Health Innovation University`
   - **Create dataset:** Toggle "Yes"
   - **Dataset name:** `production`
   - **Dataset visibility:** `Public`
3. Click "Create"

### Step 3: Get Credentials
1. In your project dashboard, go to **Settings** → **Project**
2. Copy your **Project ID** (looks like `abc123xyz`)
3. Go to **Settings** → **API** → **Tokens**
4. Click **+ Add API Token**
   - **Token name:** `HIU CMS Backend`
   - **Permissions:** Select "Editor"
5. Click **Create Token** and copy it

⚠️ **Keep these credentials safe!** You'll need them next.

---

## Phase 2: Local Setup

### Step 1: Install Dependencies

In your workspace directory:

```bash
cd /Users/ishnoorsingh/Code/HIU_dev/hiu-cms
npm install
```

This installs:
- Sanity CLI & Studio
- Dependencies for CMS
- TypeScript support

⏱️ Takes 2-5 minutes depending on internet speed.

### Step 2: Configure Environment

1. Open `.env.local` file
2. Replace with your credentials:

```
SANITY_STUDIO_PROJECT_ID=your-actual-project-id-here
SANITY_STUDIO_DATASET=production
```

3. Save the file

⚠️ **Do NOT commit `.env.local` to git** - it's in `.gitignore` for security

### Step 3: Verify Setup

Test that everything is connected:

```bash
npm run dev
```

✅ **Success:** You should see:
```
✨ Sanity Studio is running at http://localhost:3333
```

🌐 Open http://localhost:3333 in your browser

---

## Phase 3: First Look at the CMS

### What You Should See

1. **Login Screen** (if not already logged in)
2. **Main Dashboard** with:
   - Sidebar with "News Article" option
   - Create button
   - Search bar

### Explore the Admin Panel

**Sidebar Navigation:**
- **News Article** - Create/edit articles
- **Author** - Manage authors
- **Vision** (GROQ test tool) - Query data

---

## Phase 4: Create Your First Article

### Step 1: Start Article Creation

1. Click **"News Article"** in sidebar
2. Click **+ Create** button
3. Click **"News Article"**

### Step 2: Fill in Basic Info

**Slug (URL):**
- Auto-generated from title
- Example: `my-first-article`

**Title:**
- Click "English" tab
- Enter English title
- Click "Deutsch" tab  
- Enter German translation

**Summary:**
- Keep under 300 characters
- Both languages required
- Example: "Short overview of article content"

### Step 3: Add Content

**Content Field:**
- Click on language tab (English first)
- Click in text area
- Type or paste article text
- Use **B** button for bold, **I** for italic
- Use list buttons for bullets/numbers

**Pro Tips:**
- Add paragraph breaks between ideas
- Use headings (H2/H3) for sections
- You can paste formatted text

### Step 4: Add Images

**Featured Image (Main):**
1. Click "Upload" or drag image
2. Add alternative text (important for SEO!)
3. Optional: Add caption

**Gallery Images (Additional):**
1. Click "Add item"
2. Upload image same way
3. Repeat for more images

### Step 5: Set Publish Details

**Publish Date:**
1. Click date field
2. Select date (today or future)
3. Set time (or leave default)

**Status:**
1. Select "Draft" to save privately
2. Or select "Published" to go live

**Author (Optional):**
1. Click author field
2. Select existing or create new author

### Step 6: SEO (Optional but Recommended)

Under "SEO Settings":

**Meta Title:**
- Search engine title (50-60 characters)
- Example: "Health Day 2026 | HIU University"

**Meta Description:**
- Search snippet (150-160 chars)
- Example: "Join Berlin's health day event with free checks..."

**Keywords:**
- 5-10 relevant terms
- Example: ["health", "berlin", "event"]

### Step 7: Save & Publish

1. Click **Publish** button (top right)
2. Confirm publication

✅ **Done!** Your article is live.

---

## Phase 5: Managing Multiple Articles

### Create More Articles

Repeat Phase 4 for each new article.

### Update Existing Article

1. Click "News Article" in sidebar
2. Find article in list
3. Click to open
4. Make changes
5. Click **Publish** to save

### Draft vs Published

- **Draft:** Only you can see (private)
- **Published:** Visible on website
- **Archived:** Hidden from public but kept

### Organizing Articles

**Use Tags:**
- Add tags in "Tags" field
- Examples: ["announcement", "event", "news", "feature"]
- Helps with filtering and categorization

**Use Status:**
- Mark old articles as "Archived"
- Keeps database clean

---

## Phase 6: Team Access

### Add Team Members

1. Go to Sanity dashboard: https://manage.sanity.io
2. Click your project
3. Go to **Settings** → **Members**
4. Click **+ Add member**
5. Enter email address
6. Select role:
   - **Admin** - Full control
   - **Editor** - Create/edit content only
   - **Viewer** - View only

### Permissions

| Role | Create | Edit | Delete | Settings |
|------|--------|------|--------|----------|
| Admin | ✅ | ✅ | ✅ | ✅ |
| Editor | ✅ | ✅ | ❌ | ❌ |
| Viewer | ❌ | ❌ | ❌ | ❌ |

---

## Phase 7: Connect to Next.js Website

### Get API Credentials

1. Go to https://manage.sanity.io
2. Your project
3. **Settings** → **API**
4. Copy:
   - `projectId` from settings
   - `dataset` (production)

### Add to Next.js `.env.local`

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
```

### Create Sanity Client in Next.js

Create `lib/sanity.client.ts` in Next.js project:

```typescript
import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: true,
})
```

### Fetch and Display Articles

In your news page component:

```typescript
import { client } from '@/lib/sanity.client'

async function getNews() {
  const query = `
    *[_type == "news" && status == "published"] 
    | order(publishDate desc) {
      slug,
      title,
      summary,
      featuredImage,
      publishDate
    }
  `
  return await client.fetch(query)
}

export default async function NewsPage() {
  const articles = await getNews()
  
  return (
    <div>
      {articles.map((article) => (
        <article key={article.slug.current}>
          <h2>{article.title.en}</h2>
          <p>{article.summary.en}</p>
        </article>
      ))}
    </div>
  )
}
```

See **NEXT_JS_INTEGRATION.md** for complete examples.

---

## Troubleshooting

### Issue: Blank Admin Panel
**Solution:** 
- Check internet connection
- Clear browser cache (Cmd+Shift+Delete)
- Log out and back in

### Issue: "Project not found"
**Solution:**
- Verify Project ID in `.env.local`
- Check Sanity dashboard still shows project
- Restart npm server: Ctrl+C, then `npm run dev`

### Issue: Images won't upload
**Solution:**
- Check file size (max 50MB)
- Ensure proper image format (JPG, PNG, WebP)
- Check internet connection

### Issue: "Permission denied"
**Solution:**
- Verify API token has "Editor" permissions
- Regenerate new token if needed
- Check token in `.env.local` matches dashboard

### Issue: Website not showing articles
**Solution:**
- Check article status is "Published" (not Draft)
- Verify Next.js fetch query is correct
- Check Project ID matches in both CMS and Next.js
- Restart Next.js dev server

---

## Daily Workflow

### For Content Editors

1. Go to http://localhost:3333 or Sanity dashboard
2. Click "News Article"
3. Click article to edit OR click "+ Create"
4. Make changes
5. Click **Publish**
6. Changes appear on website within minutes

### For Developers

1. Update Next.js fetch queries as needed
2. Add new fields to schema
3. Update frontend components
4. Deploy changes to website

### For Managers

- Monitor article publication status
- Review team access permissions
- Backup data periodically (see exports)

---

## Best Practices

### Content Management

✅ **DO:**
- Write clear, accessible titles
- Include alt text for all images
- Use both English and German
- Save as Draft before final review
- Publish at off-peak hours

❌ **DON'T:**
- Leave fields blank (except optional ones)
- Use ALL CAPS unless necessary
- Publish without review
- Use images without alt text
- Delete articles (Archive instead)

### SEO

- Fill meta title and description
- Keep keywords relevant
- Use descriptive image alt text
- Link to related programs when relevant

### Maintenance

- Export backups monthly
- Review and archive old articles
- Keep team list updated
- Monitor API usage

---

## Next Steps

1. ✅ CMS is set up and ready
2. ⏭️ Connect to Next.js (see NEXT_JS_INTEGRATION.md)
3. ⏭️ Train team members
4. ⏭️ Publish first content
5. ⏭️ Monitor and optimize

---

## Quick Reference

| Task | How To |
|------|--------|
| Start CMS | `npm run dev` |
| Create article | Click "+ Create" → "News Article" |
| Edit article | Click article in list |
| Publish | Click "Publish" button |
| Archive old article | Change status to "Archived" |
| Add team member | Sanity dashboard → Settings → Members |
| Backup data | `npm run export` |
| Query articles | Use GROQ in Vision tab |

---

## Support Resources

- **Sanity Docs:** https://www.sanity.io/docs
- **GROQ Guide:** https://www.sanity.io/docs/groq
- **Studio Customization:** https://www.sanity.io/docs/sanity-studio
- **Next.js Integration:** https://www.sanity.io/docs/next-js

---

**Questions?** Check the relevant documentation file in this project:
- Schema details → `SCHEMA.md`
- Next.js integration → `NEXT_JS_INTEGRATION.md`
- Project setup → `README.md`
