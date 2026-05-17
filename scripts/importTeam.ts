// Import team members from hiu-website-next/lib/team-data.ts into Sanity.
// Run with: npx tsx scripts/importTeam.ts
//
// The website project's curated data (teamMembers + teamCategories) is treated
// as the single source of truth. Each member becomes one Sanity document; the
// memberships list captures every (category, subcategory, roleOverride, order)
// tuple from teamCategories.

import 'dotenv/config'
import { createClient } from '@sanity/client'
import {
  teamMembers as MEMBERS,
  teamCategories as CATEGORIES,
  type TeamMemberData,
  type TeamCategory,
} from '../../hiu-website-next/lib/team-data'

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
})

type Membership = {
  _key: string
  category: string
  subcategory?: string
  roleOverride?: string
  order: number
}

function buildMemberships(slug: string): Membership[] {
  const out: Membership[] = []
  let k = 0
  for (let i = 0; i < CATEGORIES.length; i++) {
    const cat: TeamCategory = CATEGORIES[i]

    cat.members.forEach((m, mi) => {
      if (m.slug !== slug) return
      out.push({
        _key: `mem${k++}`,
        category: cat.key,
        roleOverride: m.role && m.role !== MEMBERS[slug].role ? m.role : undefined,
        order: i * 100 + mi,
      })
    })

    cat.subcategories?.forEach((sub) => {
      sub.members.forEach((m, mi) => {
        if (m.slug !== slug) return
        out.push({
          _key: `mem${k++}`,
          category: cat.key,
          subcategory: sub.label,
          roleOverride:
            m.role && m.role !== MEMBERS[slug].role ? m.role : undefined,
          order: i * 100 + mi,
        })
      })
    })
  }
  return out
}

function buildDoc(slug: string, data: TeamMemberData) {
  const memberships = buildMemberships(slug)
  return {
    _type: 'teamMember',
    _id: `teamMember.${slug}`,
    slug: { _type: 'slug', current: slug },
    name: data.name,
    role: data.role,
    phone: data.phone,
    image: {
      url: data.image, // already an absolute ImageKit URL
      alt: data.name,
    },
    introduction: data.introduction,
    memberships,
  }
}

async function run() {
  const slugs = Object.keys(MEMBERS).sort()
  console.log(`Importing ${slugs.length} team member(s)...`)
  for (const slug of slugs) {
    const data = MEMBERS[slug]
    const doc = buildDoc(slug, data)
    const result = await client.createOrReplace(doc)
    console.log(`  ✓ ${slug} → ${result._id} (${doc.memberships.length} memberships)`)
  }
  console.log('Done.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
