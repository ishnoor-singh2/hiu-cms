require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

async function run() {
  try {
    console.log('Creating author...')
    const author = await client.createIfNotExists({
      _id: 'author-jdoe',
      _type: 'author',
      name: 'John Doe',
      email: 'john.doe@example.com',
    })
    console.log('Author created:', author._id)

    console.log('Creating program...')
    const program = await client.createIfNotExists({
      _id: 'program-gesundheitstag-2026',
      _type: 'program',
      title: { en: 'Gesundheitstag 2026', de: 'Gesundheitstag 2026' },
      slug: { _type: 'slug', current: 'gesundheitstag-2026' },
      summary: { en: 'Health day event 2026', de: 'Gesundheitstag Veranstaltung 2026' },
    })
    console.log('Program created:', program._id)

    console.log('Creating sample news...')
    const news = await client.createIfNotExists({
      _id: 'news-gesundheitstag-2026',
      _type: 'news',
      slug: { _type: 'slug', current: 'gesundheitstag-2026' },
      title: { en: 'Gesundheitstag 2026', de: 'Gesundheitstag 2026' },
      summary: { en: 'Join us for Gesundheitstag 2026', de: 'Nehmen Sie am Gesundheitstag 2026 teil' },
      content: {
        en: [
          {
            _type: 'block',
            style: 'normal',
            children: [
              { _type: 'span', text: 'Welcome to Gesundheitstag 2026. This is the English content.' },
            ],
          },
        ],
        de: [
          {
            _type: 'block',
            style: 'normal',
            children: [
              { _type: 'span', text: 'Willkommen beim Gesundheitstag 2026. Dies ist der deutsche Inhalt.' },
            ],
          },
        ],
      },
      // featuredImage is intentionally omitted so you can upload/replace in Studio
      publishDate: new Date().toISOString(),
      status: 'published',
      author: { _type: 'reference', _ref: author._id },
      relatedPrograms: [{ _type: 'reference', _ref: program._id }],
      tags: ['event', 'health'],
    })

    console.log('News created:', news._id)
    console.log('Done. Open http://localhost:3333 to edit the sample news and add the featured image.')
  } catch (err) {
    console.error('Seeding failed:', err)
    process.exit(1)
  }
}

run()
