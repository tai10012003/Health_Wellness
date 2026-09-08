import { absoluteStrapiUrl, fetchFromStrapi } from '../../utils/strapi'
import { getFallbackArticles } from '../../utils/article-fallback'
import type { LocaleCode } from '~/data/site-content'
import type { ArticleDetail } from '~/types/article'

type StrapiArticle = {
  title?: string
  slug?: string
  category?: string
  excerpt?: string
  content?: string
  readingTime?: number
  publishedAt?: string
  createdAt?: string
  cover?: {
    url?: string
    formats?: {
      medium?: { url?: string }
      small?: { url?: string }
    }
  }
  attributes?: Omit<StrapiArticle, 'attributes'>
}

type StrapiListResponse = {
  data?: StrapiArticle[]
}

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug') || ''
  const query = getQuery(event)
  const locale = query.locale === 'en' ? 'en' : 'vi'

  try {
    const response = await fetchFromStrapi<StrapiListResponse>({
      path: '/api/articles',
      query: {
        locale,
        populate: 'cover',
        'filters[slug][$eq]': slug,
        'pagination[pageSize]': 1
      }
    })

    const item = response.data?.[0]

    if (!item) {
      throw createError({ statusCode: 404, statusMessage: 'Article not found' })
    }

    return {
      source: 'strapi',
      post: mapArticle(item, locale)
    }
  } catch {
    const fallback = getFallbackArticles(locale).find((item) => item.slug === slug)
    const post = fallback
      ? {
          ...fallback,
          content:
            locale === 'en'
              ? 'Start with a realistic routine, keep your first sessions simple, and give your body enough time to adapt. A sustainable plan should include movement, recovery, nutrition, and small weekly adjustments.'
              : 'Hãy bắt đầu bằng một lịch tập thực tế, giữ các buổi đầu thật đơn giản và cho cơ thể đủ thời gian thích nghi. Một kế hoạch bền vững nên kết hợp vận động, phục hồi, dinh dưỡng và những điều chỉnh nhỏ mỗi tuần.'
        }
      : undefined

    if (!post) {
      throw createError({ statusCode: 404, statusMessage: 'Article not found' })
    }

    return {
      source: 'fallback',
      post
    }
  }
})

function mapArticle(entry: StrapiArticle, locale: LocaleCode): ArticleDetail {
  const item = entry.attributes || entry
  const date = item.publishedAt || item.createdAt
  const imagePath = item.cover?.formats?.medium?.url || item.cover?.formats?.small?.url || item.cover?.url

  return {
    title: item.title || '',
    slug: item.slug || '',
    category: item.category || '',
    date: date
      ? new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'vi-VN', {
          day: '2-digit',
          month: locale === 'en' ? 'short' : '2-digit',
          year: 'numeric'
        }).format(new Date(date))
      : '',
    image: absoluteStrapiUrl(imagePath) || getFallbackArticles(locale)[0]?.image || '',
    excerpt: item.excerpt || '',
    content: item.content,
    readingTime: item.readingTime || 4
  }
}
