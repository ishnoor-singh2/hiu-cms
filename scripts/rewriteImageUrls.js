// Rewrite featuredImage.url + gallery[].url in news_documents/*.json to use
// the ImageKit URLs that the frontend actually serves.
//
// Source of truth: hiu-website-next/scraped_news/news_articles.json
// Mapping: local_images[].local_path "scraped_news/images/<slug>/<file>"
//          -> "https://ik.imagekit.io/hiuniv/images/news/<slug>/<file>"
// Convention: first local image -> featuredImage, the rest -> gallery.

const fs = require('fs')
const path = require('path')

const IK = 'https://ik.imagekit.io/hiuniv'
const DOCS = path.join(__dirname, '..', 'news_documents')
const SCRAPED = '/Users/ishnoorsingh/Code/HIU_dev/hiu-website-next/scraped_news/news_articles.json'

const scraped = JSON.parse(fs.readFileSync(SCRAPED, 'utf8'))

function deriveSlug(url) {
  return url.replace(/\/$/, '').split('/').pop() || ''
}

const bySlug = new Map()
for (const a of scraped) bySlug.set(deriveSlug(a.url), a)

function ikUrl(localPath) {
  const p = localPath.replace('scraped_news/images/', 'images/news/')
  return `${IK}/${p}`
}

let updated = 0
let missing = []

for (const file of fs.readdirSync(DOCS).filter((f) => f.endsWith('.json')).sort()) {
  const filePath = path.join(DOCS, file)
  const doc = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  const slug = doc.slug?.current
  if (!slug) continue

  const src = bySlug.get(slug)
  if (!src || !Array.isArray(src.local_images) || src.local_images.length === 0) {
    missing.push(file)
    continue
  }

  const imgs = src.local_images
  doc.featuredImage = {
    url: ikUrl(imgs[0].local_path),
    alt: imgs[0].alt || doc.featuredImage?.alt || '',
  }
  doc.gallery = imgs.slice(1).map((img, i) => ({
    _key: `g${i + 1}`,
    url: ikUrl(img.local_path),
    alt: img.alt || '',
  }))

  fs.writeFileSync(filePath, JSON.stringify(doc, null, 2) + '\n')
  updated++
}

console.log(`Updated: ${updated}`)
if (missing.length) {
  console.log(`Missing scraped data (skipped) ${missing.length}:`)
  missing.forEach((f) => console.log('  -', f))
}
