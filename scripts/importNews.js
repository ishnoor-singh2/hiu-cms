require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@sanity/client')
const fs = require('fs')
const path = require('path')

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const DOCS_DIR = path.join(__dirname, '..', 'news_documents')

async function run() {
  const filter = process.argv[2] // optional: filename or substring to filter
  const files = fs
    .readdirSync(DOCS_DIR)
    .filter((f) => f.endsWith('.json'))
    .filter((f) => (filter ? f.includes(filter) : true))
    .sort()

  if (files.length === 0) {
    console.log('No JSON files matched.')
    return
  }

  console.log(`Importing ${files.length} document(s)...`)
  for (const file of files) {
    const fullPath = path.join(DOCS_DIR, file)
    const doc = JSON.parse(fs.readFileSync(fullPath, 'utf8'))
    try {
      const result = await client.createOrReplace(doc)
      console.log(`  ✓ ${file} → ${result._id}`)
    } catch (err) {
      console.error(`  ✗ ${file} failed:`, err.message)
      process.exitCode = 1
    }
  }
  console.log('Done.')
}

run().catch((err) => {
  console.error('Import failed:', err)
  process.exit(1)
})
