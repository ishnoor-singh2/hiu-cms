export const allPublishedNews = `*[_type == "news" && status == "published"] | order(publishDate desc) {
  _id,
  title,
  slug,
  summary,
  featuredImage,
  publishDate,
  "authorName": author->name,
  tags
}`

export const newsBySlug = `*[_type == "news" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  summary,
  content,
  featuredImage,
  publishDate,
  author->,
  relatedPrograms[]->
}`

export default { allPublishedNews, newsBySlug }
