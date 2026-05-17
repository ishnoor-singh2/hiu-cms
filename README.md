# HIU CMS - Sanity Setup

Health Innovation University Content Management System built with Sanity.

## Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Sanity account (free at https://sanity.io)

### Installation

1. **Clone the project**
   ```bash
   cd /Users/ishnoorsingh/Code/HIU_dev/hiu-cms
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a Sanity project**
   - Go to https://manage.sanity.io
   - Click "Create new project"
   - Fill in project details:
     - Name: `HIU CMS`
     - Dataset: `production`
   - Note your Project ID and API Token

4. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and fill in:
   - `SANITY_STUDIO_PROJECT_ID` - from step 3
   - `SANITY_STUDIO_DATASET` - production

5. **Start the Sanity Studio**
   ```bash
   npm run dev
   ```
   
   The CMS will be available at `http://localhost:3333`

## Project Structure

```
hiu-cms/
├── sanity/
│   ├── schemaTypes/
│   │   ├── index.ts              # Schema exports
│   │   ├── news.ts               # News article schema
│   │   └── author.ts             # Author schema
│   └── plugins/                  # Custom Sanity plugins
├── sanity.config.ts              # Main Sanity configuration
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── .env.local                    # Environment variables (gitignored)
└── README.md                     # This file
```

## Content Models

### News Article
The main content type for managing news and updates.

**Fields:**
- `slug` - URL-friendly identifier (auto-generated from title)
- `title` - Article title (English & German)
- `summary` - Short excerpt (300 chars max)
- `content` - Full article with rich text editing
- `featuredImage` - Main article image with alt text
- `gallery` - Additional images gallery
- `publishDate` - When article goes live
- `status` - Draft/Published/Archived
- `author` - Reference to author
- `seo` - Meta title, description, keywords
- `tags` - Categorization tags
- `relatedPrograms` - Link to programs (future use)

**Bilingual Support:**
All text fields support English (en) and German (de).

## Usage

### Creating a News Article

1. Go to CMS Studio (http://localhost:3333)
2. Click on "News Article" in the sidebar
3. Click "Create" → "News Article"
4. Fill in fields:
   - **Title**: Add both English and German titles
   - **Summary**: Keep under 300 characters
   - **Content**: Use rich text editor (supports formatting, images, lists)
   - **Featured Image**: Upload hero image
   - **Gallery**: Add additional images
   - **Publish Date**: Select date and time
   - **Status**: Choose Draft or Published
5. Click "Publish"

### Connecting to Next.js Frontend

See `NEXT_JS_INTEGRATION.md` for detailed integration instructions.

## Commands

- `npm run dev` - Start Sanity Studio
- `npm run build` - Build Sanity project
- `npm run deploy` - Deploy to Sanity
- `npm run export` - Export dataset backup
- `npm run import` - Import dataset backup

## Multi-Language Strategy

The CMS supports both German and English:
- Content is managed at the document level (one document per article)
- All text fields have separate inputs for both languages
- The Next.js frontend queries specific language versions using GROQ

### Example Query:
```groq
*[_type == "news" && status == "published"] | order(publishDate desc) {
  slug,
  title { en, de },
  summary { en, de },
  content { en, de },
  featuredImage { asset->{ url }, alt { en, de } },
  publishDate
}
```

## SEO Features

Each article has dedicated SEO fields:
- **Meta Title** - Custom title for search results (50-60 chars)
- **Meta Description** - Search snippet (150-160 chars)
- **Keywords** - Tagging for relevance

## Future Content Types

The schema is designed to scale. Planned content types:
- **Program** - Degree programs and courses
- **Team Member** - Faculty and staff profiles
- **Event** - Campus events and announcements
- **Testimonial** - Student and alumni testimonials

## Support & Documentation

- [Sanity Docs](https://www.sanity.io/docs)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
- [Sanity Studio Customization](https://www.sanity.io/docs/sanity-studio)

## License

MIT
