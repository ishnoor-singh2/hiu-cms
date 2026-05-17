Sanity → Next.js integration examples

Files here show a minimal `sanityClient` and helper utilities you can copy into your Next.js frontend.

Usage
- Copy `lib/sanity.client.ts` and `lib/sanity.image.ts` into your Next.js project's `lib/` folder.
- Copy `queries/newsQueries.ts` into a `queries/` folder and import the queries where needed.
- Ensure your Next.js app has these env variables set:
  - `NEXT_PUBLIC_SANITY_PROJECT_ID` (e.g. no8n13uj)
  - `NEXT_PUBLIC_SANITY_DATASET` (e.g. production)

Example fetch in Next.js (server-side):

```ts
import { sanityClient } from '../lib/sanity.client'
import { allPublishedNews } from '../queries/newsQueries'

export async function getStaticProps() {
  const news = await sanityClient.fetch(allPublishedNews)
  return { props: { news }, revalidate: 60 }
}
```

Image helper
- Use `urlFor(image).width(800).url()` to build image URLs from the `featuredImage` object.
