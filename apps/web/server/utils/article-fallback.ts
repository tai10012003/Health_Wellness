import { articlesContent, type LocaleCode } from '~/data/site-content'
import type { ArticleSummary } from '~/types/article'

export function getFallbackArticles(locale: LocaleCode): ArticleSummary[] {
  return articlesContent[locale].posts.map((post) => ({
    title: post.title,
    slug: slugify(post.title),
    category: post.category,
    date: post.date,
    image: post.image,
    excerpt: post.excerpt,
    readingTime: 4
  }))
}

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
