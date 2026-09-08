export type ArticleSummary = {
  title: string
  slug: string
  category: string
  date: string
  image: string
  excerpt: string
  readingTime?: number
}

export type ArticleDetail = ArticleSummary & {
  content?: string
}
