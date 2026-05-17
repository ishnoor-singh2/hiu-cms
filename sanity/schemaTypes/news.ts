import { defineField, defineType } from 'sanity'

// Reusable inline-image object for rich text content.
// Uses an ImageKit URL string instead of a Sanity-uploaded image.
const inlineImage = {
  type: 'object',
  name: 'inlineImage',
  title: 'Image',
  fields: [
    {
      name: 'url',
      title: 'ImageKit URL',
      type: 'url',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'alt',
      type: 'string',
      title: 'Alternative text',
      description: 'Important for SEO and accessibility',
    },
    {
      name: 'caption',
      type: 'string',
      title: 'Caption',
    },
  ],
  preview: {
    select: { title: 'alt', subtitle: 'url' },
  },
}

const richTextOf = [
  {
    type: 'block',
    styles: [
      { title: 'Normal', value: 'normal' },
      { title: 'Heading 2', value: 'h2' },
      { title: 'Heading 3', value: 'h3' },
      { title: 'Quote', value: 'blockquote' },
    ],
    lists: [
      { title: 'Bullet', value: 'bullet' },
      { title: 'Numbered', value: 'number' },
    ],
    marks: {
      decorators: [
        { title: 'Strong', value: 'strong' },
        { title: 'Emphasis', value: 'em' },
        { title: 'Underline', value: 'underline' },
        { title: 'Code', value: 'code' },
      ],
    },
  },
  inlineImage,
]

export default defineType({
  name: 'news',
  title: 'News Article',
  type: 'document',
  fields: [
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-friendly identifier (e.g., gesundheitstag-2026)',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'title.en',
        slugify: (input) =>
          input
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, ''),
      },
    }),

    defineField({
      name: 'title',
      title: 'Title',
      type: 'object',
      description: 'Article title in English and German',
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: 'en',
          title: 'English',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'de',
          title: 'Deutsch',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),

    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'object',
      description: 'Short excerpt shown in news listings',
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: 'en',
          title: 'English',
          type: 'text',
          rows: 3,
          validation: (Rule) => Rule.required().max(500),
        }),
        defineField({
          name: 'de',
          title: 'Deutsch',
          type: 'text',
          rows: 3,
          validation: (Rule) => Rule.required().max(500),
        }),
      ],
    }),

    defineField({
      name: 'content',
      title: 'Content',
      type: 'object',
      description: 'Full article content with rich text formatting',
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: 'en',
          title: 'English',
          type: 'array',
          of: richTextOf,
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'de',
          title: 'Deutsch',
          type: 'array',
          of: richTextOf,
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),

    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'object',
      description: 'Main hero image for the article (ImageKit URL)',
      validation: (Rule) => Rule.required(),
      fields: [
        {
          name: 'url',
          title: 'ImageKit URL',
          type: 'url',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Important for SEO and accessibility',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Caption',
        },
      ],
    }),

    defineField({
      name: 'gallery',
      title: 'Image Gallery',
      type: 'array',
      description: 'Additional images for the article (ImageKit URLs)',
      of: [
        {
          type: 'object',
          name: 'galleryImage',
          fields: [
            {
              name: 'url',
              title: 'ImageKit URL',
              type: 'url',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
          ],
          preview: {
            select: { title: 'alt', subtitle: 'url' },
          },
        },
      ],
    }),

    defineField({
      name: 'publishDate',
      title: 'Publish Date',
      type: 'datetime',
      description: 'When this article should be published',
      validation: (Rule) => Rule.required(),
      options: {
        dateFormat: 'DD.MM.YYYY',
        timeFormat: 'HH:mm',
        timeStep: 15,
      },
    }),

    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Published', value: 'published' },
          { title: 'Archived', value: 'archived' },
        ],
        layout: 'radio',
      },
      initialValue: 'published',
      validation: (Rule) => Rule.required(),
    }),

  ],

  preview: {
    select: {
      title: 'title.en',
      subtitle: 'publishDate',
      mediaUrl: 'featuredImage.url',
    },
    prepare(selection) {
      const { title, subtitle } = selection
      const date = subtitle
        ? new Date(subtitle).toLocaleDateString('de-DE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })
        : ''
      return {
        title: title || 'Untitled',
        subtitle: date,
      }
    },
  },
})
