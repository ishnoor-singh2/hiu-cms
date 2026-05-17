import { defineField, defineType } from 'sanity'

// Stable category keys used by the frontend to resolve i18n labels
// (must match the keys in messages/{en,de}.json → aboutUniversityTeam.categories.*)
const CATEGORY_KEYS = [
  'praesidium',
  'geschaeftsfuehrung',
  'headOfDepartments',
  'research',
  'programDirectors',
  'faculty',
  'centralAdmin',
  'studyCenters',
  'equalOpportunities',
] as const

const STUDY_CENTER_LABELS = ['Berlin', 'Hamburg', 'München', 'Stuttgart'] as const

export default defineType({
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  fields: [
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: { source: 'name', maxLength: 96 },
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Full name with titles (e.g. "Prof. Dr. phil. Mariam Hartinger")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Default Role',
      type: 'string',
      description:
        'Canonical role label (e.g. "Präsidentin"). May be overridden per-category in the memberships list below.',
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'object',
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: 'url',
          title: 'ImageKit URL',
          type: 'url',
          validation: (Rule) => Rule.required(),
        }),
        defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
      ],
    }),
    defineField({
      name: 'introduction',
      title: 'Introduction / Bio',
      type: 'text',
      rows: 10,
      description: 'Paragraphs separated by single newlines (preserves legacy format).',
    }),
    defineField({
      name: 'memberships',
      title: 'Category Memberships',
      type: 'array',
      description:
        'Where this person appears on the listing page. A person can belong to multiple categories.',
      of: [
        {
          type: 'object',
          name: 'membership',
          fields: [
            {
              name: 'category',
              title: 'Category',
              type: 'string',
              validation: (Rule) => Rule.required(),
              options: {
                list: CATEGORY_KEYS.map((k) => ({ title: k, value: k })),
                layout: 'dropdown',
              },
            },
            {
              name: 'subcategory',
              title: 'Sub-category (only for Study Centers)',
              type: 'string',
              options: {
                list: STUDY_CENTER_LABELS.map((l) => ({ title: l, value: l })),
              },
            },
            {
              name: 'roleOverride',
              title: 'Role Override',
              type: 'string',
              description:
                'Optional. If set, this label is shown instead of the default role for this category.',
            },
            {
              name: 'order',
              title: 'Order',
              type: 'number',
              description: 'Lower numbers appear first within the category/subcategory.',
              initialValue: 100,
            },
          ],
          preview: {
            select: {
              category: 'category',
              sub: 'subcategory',
              role: 'roleOverride',
              order: 'order',
            },
            prepare({ category, sub, role, order }) {
              return {
                title: [category, sub].filter(Boolean).join(' / '),
                subtitle: [role && `role: ${role}`, `order: ${order}`].filter(Boolean).join(' · '),
              }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'role', mediaUrl: 'image.url' },
    prepare({ title, subtitle }) {
      return { title: title || 'Untitled', subtitle }
    },
  },
})
