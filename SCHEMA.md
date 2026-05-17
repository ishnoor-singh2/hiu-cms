# Sanity Schema Documentation

## News Article Schema (`news.ts`)

Complete reference for the News Article content type.

### Structure Overview

```
News Article (document)
├── slug (slug, unique)
├── title (object with en/de)
├── summary (object with en/de)
├── content (object with en/de, rich text)
├── featuredImage (image with alt text)
├── gallery (array of images)
├── publishDate (datetime)
├── status (enum: draft/published/archived)
├── author (reference to author)
├── seo (object)
│   ├── metaTitle (en/de)
│   ├── metaDescription (en/de)
│   └── keywords (array)
├── relatedPrograms (array of references)
└── tags (array of strings)
```

---

## Field Definitions

### `slug`
**Type:** Slug  
**Required:** Yes  
**Unique:** Yes  

URL-friendly identifier for the article. Auto-generated from English title.

**Example values:**
- `gesundheitstag-2026`
- `new-name-new-campus`
- `berlin-health-day`

**Rules:**
- Lowercase letters, numbers, hyphens only
- Auto-generated from title (editable)
- Must be unique across all articles

---

### `title`
**Type:** Object (Bilingual)  
**Required:** Yes  
**Fields:**
- `en` (string, required)
- `de` (string, required)

Main article headline.

**Example:**
```
EN: Berlin's First District-Wide Health Day in Marzahn-Hellersdorf
DE: Berlins erster bezirksweiter Gesundheitstag in Marzahn-Hellersdorf
```

---

### `summary`
**Type:** Object (Bilingual Text)  
**Required:** Yes  
**Max Length:** 300 characters per language  
**Fields:**
- `en` (text)
- `de` (text)

Short excerpt displayed in news listings and search results.

**Example:**
```
EN: The first district-wide Health Day brought together 
institutions, educational partners, and residents with 
high-profile guests and health checks.

DE: Der erste bezirksweite Gesundheitstag brachte Institutionen, 
Bildungspartner und Bürger zusammen mit prominenten Gästen 
und Gesundheitschecks.
```

**Best Practices:**
- Keep concise (150-200 chars recommended)
- Entice readers with key information
- Use clear, accessible language

---

### `content`
**Type:** Object (Bilingual Rich Text)  
**Required:** Yes  
**Format:** Portable Text (block-based)  
**Fields:**
- `en` (array of blocks)
- `de` (array of blocks)

Full article content with rich formatting.

**Supported Elements:**
- **Block Styles:**
  - Normal paragraph
  - Heading 2 & 3
  - Block quotes
  
- **Lists:**
  - Bullet points
  - Numbered lists
  
- **Text Marks:**
  - Strong (bold)
  - Emphasis (italic)
  - Underline
  - Code
  
- **Inline Elements:**
  - Images with captions
  - Links (planned)

**Example Structure:**
```
[
  {
    "_type": "block",
    "style": "normal",
    "children": [
      { "text": "The Health Day brought together..." }
    ]
  },
  {
    "_type": "image",
    "asset": { "_ref": "image-xyz..." },
    "alt": "Health Day participants"
  }
]
```

---

### `featuredImage`
**Type:** Image  
**Required:** Yes  
**Fields:**
- `asset` - Image file reference
- `hotspot` - Image cropping coordinates
- `alt` (required) - Alternative text for accessibility
- `caption` - Optional image caption

Main hero image displayed prominently.

**Requirements:**
- Recommended size: 1200x800px or larger
- Format: JPG, PNG, WebP
- Alt text required for SEO and accessibility

**Example Alt Text:**
- German: "Erster bezirksweiter Gesundheitstag in Marzahn-Hellersdorf auf dem Gesundheitscampus"
- English: "Berlin's First District-Wide Health Day at Health Campus"

---

### `gallery`
**Type:** Array of Images  
**Required:** No  
**Fields (per image):**
- `asset` - Image file
- `hotspot` - Cropping
- `alt` (required) - Alternative text
- `caption` - Image description

Additional images displayed in gallery below article.

**Usage:**
- Add 3-10 images for visual richness
- Each image should have descriptive alt text
- Order matters (drag to reorder)

---

### `publishDate`
**Type:** DateTime  
**Required:** Yes  
**Format:** DD.MM.YYYY HH:mm  

When the article becomes visible to readers.

**Features:**
- 15-minute intervals
- Future-dates allowed (schedule publications)
- Used for sorting (newest first)

**Example:** 12.05.2026 14:30

---

### `status`
**Type:** Enum  
**Required:** Yes  
**Default:** draft  
**Options:**
- `draft` - Not visible to readers
- `published` - Visible on website
- `archived` - Hidden but kept for reference

Visibility and publication state.

**Workflow:**
1. Create article as Draft
2. Review and edit
3. Change to Published
4. Change to Archived (when outdated)

---

### `author`
**Type:** Reference to Author  
**Required:** No  
**Linked Document:** Author

WHO wrote or is responsible for the article.

**Usage:**
- Select from existing authors
- Create new author if needed
- Optional field (can be left blank)

**Author Fields:**
- Name
- Email
- Profile image
- Bio

---

### `seo`
**Type:** Object  
**Required:** No (but recommended)  
**Fields:**
- `metaTitle` (object, en/de)
- `metaDescription` (object, en/de)
- `keywords` (array)

Search engine optimization metadata.

#### `metaTitle`
- **Type:** String (per language)
- **Length:** 50-60 characters
- **Purpose:** Appears in browser tabs and search results

**Example:**
```
EN: Berlin Health Day 2026 | HIU University
DE: Berliner Gesundheitstag 2026 | HIU Hochschule
```

#### `metaDescription`
- **Type:** Text (per language)
- **Length:** 150-160 characters
- **Purpose:** Search result snippet shown below title

**Example:**
```
EN: Join Berlin's first district-wide health day featuring 
free health checks, workshops, and career information for 
healthcare professionals.

DE: Berlins erster bezirksweiter Gesundheitstag mit kostenlosen 
Gesundheitschecks, Workshops und Informationen zu Karrieren 
im Gesundheitswesen.
```

#### `keywords`
- **Type:** Array of strings
- **Typical:** 5-10 keywords
- **Purpose:** Help search engines understand article topics

**Example:**
```
[
  "health day",
  "berlin",
  "marzahn-hellersdorf",
  "health education",
  "university",
  "degree programs",
  "career paths"
]
```

---

### `relatedPrograms`
**Type:** Array of References  
**Required:** No  
**Linked Document:** Program (future)  

Links to degree programs or courses mentioned in the article.

**Usage:**
- Articles about programs can reference those programs
- Enables cross-content discovery
- Example: Article mentions Digital Health program → link to program document

---

### `tags`
**Type:** Array of Strings  
**Required:** No  

Categorization tags for filtering and organization.

**Examples:**
```
["announcement", "event", "health-campus", "berlin"]
["degree-program", "digital-health", "partnership"]
["student-feature", "career", "interview"]
```

**Best Practices:**
- Use consistent, lowercase tags
- Create a standard vocabulary
- Use 3-5 tags per article
- Examples: announcement, event, news, feature, interview, partnership

---

## Bilingual Content Management

### How It Works

All text fields are **localized objects** with separate `en` and `de` properties:

```typescript
title: {
  en: "English Title",
  de: "German Title"
}
```

### Admin Interface

In Sanity Studio, localized fields appear as tabs:

```
[English Tab] [German Tab]
├─ Field input (EN)
└─ Field input (DE)
```

### Translation Strategy

**Option 1: Original Source**
- Write English first
- Translate to German
- Or vice versa

**Option 2: Native Speakers**
- Assign content creation by language
- Editors handle their native language

**Option 3: Machine + Review**
- Use translation tool to generate
- Native speaker reviews and edits

---

## Data Example

Here's a complete news article document:

```json
{
  "_id": "news-001",
  "_type": "news",
  "slug": {
    "current": "gesundheitstag-2026"
  },
  "title": {
    "en": "Berlin's First District-Wide Health Day in Marzahn-Hellersdorf",
    "de": "Berlins erster bezirksweiter Gesundheitstag in Marzahn-Hellersdorf"
  },
  "summary": {
    "en": "The first district-wide Health Day brought together institutions...",
    "de": "Der erste bezirksweite Gesundheitstag brachte Institutionen..."
  },
  "content": {
    "en": [
      {
        "_type": "block",
        "children": [
          { "_key": "abc123", "text": "The first district-wide Health Day..." }
        ]
      }
    ],
    "de": [
      {
        "_type": "block",
        "children": [
          { "_key": "def456", "text": "Der erste bezirksweite Gesundheitstag..." }
        ]
      }
    ]
  },
  "featuredImage": {
    "asset": { "_ref": "image-xyz123" },
    "alt": {
      "en": "Health Day participants",
      "de": "Teilnehmer des Gesundheitstags"
    }
  },
  "publishDate": "2026-05-12T14:30:00Z",
  "status": "published",
  "seo": {
    "metaTitle": {
      "en": "Berlin Health Day 2026",
      "de": "Berliner Gesundheitstag 2026"
    },
    "metaDescription": {
      "en": "Join Berlin's health day...",
      "de": "Nimm am Berliner Gesundheitstag teil..."
    },
    "keywords": ["health", "berlin", "education"]
  },
  "tags": ["announcement", "event", "berlin"]
}
```

---

## Validation Rules

| Field | Required | Unique | Max Length | Validation |
|-------|----------|--------|------------|-----------|
| slug | ✅ | ✅ | - | Auto-generated, lowercase |
| title.en | ✅ | - | - | String |
| title.de | ✅ | - | - | String |
| summary.en | ✅ | - | 300 | Text |
| summary.de | ✅ | - | 300 | Text |
| content.en | ✅ | - | - | Rich text |
| content.de | ✅ | - | - | Rich text |
| featuredImage | ✅ | - | - | Image + alt |
| gallery | ❌ | - | - | Array of images |
| publishDate | ✅ | - | - | DateTime |
| status | ✅ | - | - | draft/published/archived |
| author | ❌ | - | - | Reference |
| seo | ❌ | - | - | Object |
| tags | ❌ | - | - | Array |

---

## Future Expansion

### Planned Fields
- `relatedPrograms` - Links to program documents
- `author` - Author/creator reference
- `categories` - Predefined categories

### Planned Content Types
- **Program** - Degree programs
- **Team Member** - Faculty/staff
- **Event** - Campus events
- **Testimonial** - Student stories
