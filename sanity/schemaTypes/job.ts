import { defineField, defineType } from 'sanity'

// Bilingual string/text helpers (kept inline to mirror the news.ts convention)
const bilingualString = (name: string, title: string, required = false) =>
  defineField({
    name,
    title,
    type: 'object',
    validation: required ? (Rule) => Rule.required() : undefined,
    fields: [
      defineField({
        name: 'en',
        title: 'English',
        type: 'string',
        ...(required ? { validation: (Rule) => Rule.required() } : {}),
      }),
      defineField({
        name: 'de',
        title: 'German',
        type: 'string',
        ...(required ? { validation: (Rule) => Rule.required() } : {}),
      }),
    ],
  })

const bilingualText = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'object',
    fields: [
      defineField({ name: 'en', title: 'English', type: 'text', rows: 3 }),
      defineField({ name: 'de', title: 'German', type: 'text', rows: 3 }),
    ],
  })

// Array of plain strings (raw HTML <b> tags may be present and are preserved).
const bilingualStringArray = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'object',
    fields: [
      defineField({
        name: 'en',
        title: 'English',
        type: 'array',
        of: [{ type: 'string' }],
      }),
      defineField({
        name: 'de',
        title: 'German',
        type: 'array',
        of: [{ type: 'string' }],
      }),
    ],
  })

// Task list: each task has text (may contain <b>) and optional subItems list.
const taskItem = {
  type: 'object',
  name: 'taskItem',
  fields: [
    { name: 'text', title: 'Text', type: 'string' },
    {
      name: 'subItems',
      title: 'Sub-items',
      type: 'array',
      of: [{ type: 'string' }],
    },
  ],
}

const bilingualTaskArray = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'object',
    fields: [
      defineField({
        name: 'en',
        title: 'English',
        type: 'array',
        of: [taskItem],
      }),
      defineField({
        name: 'de',
        title: 'German',
        type: 'array',
        of: [taskItem],
      }),
    ],
  })

export default defineType({
  name: 'job',
  title: 'Job Posting',
  type: 'document',
  fields: [
    // ----- Locale-neutral metadata -----
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: { source: 'reference', maxLength: 96 },
    }),
    defineField({
      name: 'publishedDate',
      title: 'Published Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'deadline',
      title: 'Application Deadline',
      type: 'date',
    }),
    defineField({
      name: 'reference',
      title: 'Reference Code',
      type: 'string',
      description: 'Internal reference / Kennung (e.g. BV_B_DH_engl_100)',
    }),
    defineField({
      name: 'applyEmail',
      title: 'Application Email',
      type: 'string',
    }),
    defineField({
      name: 'contactPerson',
      title: 'Contact Person',
      type: 'string',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Open', value: 'open' },
          { title: 'Closed', value: 'closed' },
        ],
        layout: 'radio',
      },
      initialValue: 'open',
    }),

    // ----- Bilingual content -----
    bilingualString('title', 'Title', true),
    bilingualString('titleSubtitle', 'Title Subtitle'),
    bilingualString('category', 'Category'),
    bilingualString('location', 'Location'),
    bilingualString('contactRole', 'Contact Role'),
    bilingualText('descriptionIntro', 'Description Intro'),

    defineField({
      name: 'quickFacts',
      title: 'Quick Facts',
      type: 'object',
      fields: [
        defineField({
          name: 'en',
          title: 'English',
          type: 'object',
          fields: [
            { name: 'wo', title: 'Wo / Where', type: 'string' },
            { name: 'locationLabel', title: 'Location Label', type: 'string' },
            { name: 'abWann', title: 'Ab wann / Start', type: 'string' },
            { name: 'umfang', title: 'Umfang / Scope', type: 'string' },
          ],
        }),
        defineField({
          name: 'de',
          title: 'German',
          type: 'object',
          fields: [
            { name: 'wo', title: 'Wo / Where', type: 'string' },
            { name: 'locationLabel', title: 'Location Label', type: 'string' },
            { name: 'abWann', title: 'Ab wann / Start', type: 'string' },
            { name: 'umfang', title: 'Umfang / Scope', type: 'string' },
          ],
        }),
      ],
    }),

    bilingualStringArray('companyIntro', 'Company Intro Paragraphs'),
    bilingualString('roleHighlight', 'Role Highlight'),

    bilingualString('tasksHeadingOverride', 'Tasks Heading Override'),
    bilingualTaskArray('tasks', 'Tasks'),

    bilingualString('requirementsHeadingOverride', 'Requirements Heading Override'),
    bilingualString('requirementsSubtitle', 'Requirements Subtitle'),
    bilingualStringArray('requirements', 'Requirements'),

    bilingualString('benefitsHeadingOverride', 'Benefits Heading Override'),
    bilingualStringArray('benefits', 'Benefits'),

    bilingualStringArray('nonDiscriminationText', 'Non-Discrimination Text'),
    bilingualStringArray('applicationDocuments', 'Application Documents'),
    bilingualString('applicationDeadlineText', 'Application Deadline Text'),
    bilingualText('dataPrivacyText', 'Data Privacy Text'),
    bilingualString('pdfUrl', 'PDF URL'),
  ],
  preview: {
    select: {
      title: 'title.de',
      subtitle: 'publishedDate',
      status: 'status',
    },
    prepare({ title, subtitle, status }) {
      return {
        title: title || 'Untitled',
        subtitle: [status, subtitle].filter(Boolean).join(' · '),
      }
    },
  },
})
