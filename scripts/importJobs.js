// Import jobs from hiu-website-next/scraped_jobs/jobs.json into Sanity.
// Treats jobs.json as the single source of truth.
//
// Each task entry is normalised to { text, subItems[] }.
// Plain strings in the source become { text, subItems: [] }.
// All other strings (including those with raw <b> tags) are stored verbatim.

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@sanity/client')
const fs = require('fs')

const SOURCE = '/Users/ishnoorsingh/Code/HIU_dev/hiu-website-next/scraped_jobs/jobs.json'

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

function key(prefix, i) {
  return `${prefix}${i}`
}

function normaliseTasks(tasks, langPrefix) {
  if (!Array.isArray(tasks)) return []
  return tasks.map((t, i) => {
    const _key = key(`${langPrefix}t`, i)
    if (typeof t === 'string') {
      return { _key, _type: 'taskItem', text: t, subItems: [] }
    }
    return {
      _key,
      _type: 'taskItem',
      text: t.text || '',
      subItems: Array.isArray(t.subItems) ? t.subItems : [],
    }
  })
}

function bilingualString(de, en) {
  return { en: en ?? '', de: de ?? '' }
}

function bilingualArray(de, en) {
  return { en: Array.isArray(en) ? en : [], de: Array.isArray(de) ? de : [] }
}

function buildDoc(job) {
  const de = job.i18n?.de || {}
  const en = job.i18n?.en || {}

  return {
    _type: 'job',
    _id: `job.${job.slug}`,
    slug: { _type: 'slug', current: job.slug },
    publishedDate: job.publishedDate,
    deadline: job.deadline,
    reference: job.reference,
    applyEmail: job.applyEmail,
    contactPerson: job.contactPerson,
    status: 'open',

    title: bilingualString(de.title, en.title),
    titleSubtitle: bilingualString(de.titleSubtitle, en.titleSubtitle),
    category: bilingualString(de.category, en.category),
    location: bilingualString(de.location, en.location),
    contactRole: bilingualString(de.contactRole, en.contactRole),
    descriptionIntro: bilingualString(de.descriptionIntro, en.descriptionIntro),

    quickFacts: {
      en: {
        wo: en.quickFacts?.wo || '',
        locationLabel: en.quickFacts?.locationLabel || '',
        abWann: en.quickFacts?.abWann || '',
        umfang: en.quickFacts?.umfang || '',
      },
      de: {
        wo: de.quickFacts?.wo || '',
        locationLabel: de.quickFacts?.locationLabel || '',
        abWann: de.quickFacts?.abWann || '',
        umfang: de.quickFacts?.umfang || '',
      },
    },

    companyIntro: bilingualArray(de.companyIntro, en.companyIntro),
    roleHighlight: bilingualString(de.roleHighlight, en.roleHighlight),

    tasksHeadingOverride: bilingualString(
      de.tasksHeadingOverride,
      en.tasksHeadingOverride,
    ),
    tasks: {
      en: normaliseTasks(en.tasks, 'en'),
      de: normaliseTasks(de.tasks, 'de'),
    },

    requirementsHeadingOverride: bilingualString(
      de.requirementsHeadingOverride,
      en.requirementsHeadingOverride,
    ),
    requirementsSubtitle: bilingualString(
      de.requirementsSubtitle,
      en.requirementsSubtitle,
    ),
    requirements: bilingualArray(de.requirements, en.requirements),

    benefitsHeadingOverride: bilingualString(
      de.benefitsHeadingOverride,
      en.benefitsHeadingOverride,
    ),
    benefits: bilingualArray(de.benefits, en.benefits),

    nonDiscriminationText: bilingualArray(
      de.nonDiscriminationText,
      en.nonDiscriminationText,
    ),
    applicationDocuments: bilingualArray(
      de.applicationDocuments,
      en.applicationDocuments,
    ),
    applicationDeadlineText: bilingualString(
      de.applicationDeadlineText,
      en.applicationDeadlineText,
    ),
    dataPrivacyText: bilingualString(de.dataPrivacyText, en.dataPrivacyText),
    pdfUrl: bilingualString(de.pdfUrl, en.pdfUrl),
  }
}

async function run() {
  const jobs = JSON.parse(fs.readFileSync(SOURCE, 'utf8'))
  console.log(`Importing ${jobs.length} job(s)...`)
  for (const job of jobs) {
    const doc = buildDoc(job)
    const result = await client.createOrReplace(doc)
    console.log(`  ✓ ${job.slug} → ${result._id}`)
  }
  console.log('Done.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
