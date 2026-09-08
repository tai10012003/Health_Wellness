import { absoluteStrapiUrl, fetchFromStrapi } from '../utils/strapi'
import { getFallbackArticles } from '../utils/article-fallback'
import type { LocaleCode } from '~/data/site-content'
import type { ArticleSummary } from '~/types/article'

type StrapiMedia = {
  url?: string
  formats?: {
    medium?: { url?: string }
    small?: { url?: string }
    thumbnail?: { url?: string }
  }
}

type StrapiArticle = {
  id?: number
  documentId?: string
  title?: string
  slug?: string
  category?: string
  excerpt?: string
  readingTime?: number
  publishedAt?: string
  createdAt?: string
  cover?: StrapiMedia | { data?: { attributes?: StrapiMedia } }
  attributes?: Omit<StrapiArticle, 'attributes'>
}

type StrapiListResponse = {
  data?: StrapiArticle[]
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const locale = query.locale === 'en' ? 'en' : 'vi'

  try {
    const response = await fetchFromStrapi<StrapiListResponse>({
      path: '/api/articles',
      query: {
        locale,
        populate: 'cover',
        sort: 'publishedAt:desc',
        'pagination[pageSize]': 12
      }
    })

    const posts = (response.data || []).map((entry) => mapArticle(entry, locale))

    return {
      source: 'strapi',
      posts
    }
  } catch {
    return {
      source: 'fallback',
      posts: getFallbackArticles(locale)
    }
  }
})

function mapArticle(entry: StrapiArticle, locale: LocaleCode): ArticleSummary {
  const item = entry.attributes || entry
  const cover = normalizeCover(item.cover)
  const date = item.publishedAt || item.createdAt

  return {
    title: item.title || '',
    slug: item.slug || '',
    category: item.category || '',
    date: formatArticleDate(date, locale),
    image:
      absoluteStrapiUrl(cover?.formats?.medium?.url || cover?.formats?.small?.url || cover?.url) ||
      fallbackImage(locale),
    excerpt: item.excerpt || '',
    readingTime: item.readingTime || 4
  }
}

function normalizeCover(cover: StrapiArticle['cover']): StrapiMedia | undefined {
  if (!cover) {
    return undefined
  }

  if ('data' in cover) {
    return cover.data?.attributes
  }

  return cover
}

function formatArticleDate(value: string | undefined, locale: LocaleCode): string {
  if (!value) {
    return ''
  }

  return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'vi-VN', {
    day: '2-digit',
    month: locale === 'en' ? 'short' : '2-digit',
    year: 'numeric'
  }).format(new Date(value))
}

function fallbackImage(locale: LocaleCode): string {
  return getFallbackArticles(locale)[0]?.image || ''
}
