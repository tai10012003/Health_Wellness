import { absoluteStrapiUrl, fetchFromStrapi } from '../../utils/strapi'
import { getFallbackCareerContent, getFallbackCareers } from '../../utils/career-fallback'
import type { LocaleCode } from '~/data/site-content'
import type { CareerDetail } from '~/types/career'

type StrapiCareer = {
  title?: string
  slug?: string
  department?: string
  location?: string
  type?: string
  excerpt?: string
  content?: string
  salary?: string
  publishedAt?: string
  createdAt?: string
  cover?: {
    url?: string
    formats?: {
      medium?: { url?: string }
      small?: { url?: string }
    }
  }
  attributes?: Omit<StrapiCareer, 'attributes'>
}

type StrapiListResponse = {
  data?: StrapiCareer[]
}

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug') || ''
  const query = getQuery(event)
  const locale = query.locale === 'en' ? 'en' : 'vi'

  try {
    const response = await fetchFromStrapi<StrapiListResponse>({
      path: '/api/job-posts',
      query: {
        locale,
        populate: 'cover',
        'filters[slug][$eq]': slug,
        'pagination[pageSize]': 1
      }
    })

    const item = response.data?.[0]

    if (!item) {
      throw createError({ statusCode: 404, statusMessage: 'Career post not found' })
    }

    return {
      source: 'strapi',
      post: mapCareer(item, locale)
    }
  } catch {
    const fallback = getFallbackCareers(locale).find((item) => item.slug === slug)
    const post = fallback
      ? {
          ...fallback,
          content: getFallbackCareerContent(locale, fallback.title)
        }
      : undefined

    if (!post) {
      throw createError({ statusCode: 404, statusMessage: 'Career post not found' })
    }

    return {
      source: 'fallback',
      post
    }
  }
})

function mapCareer(entry: StrapiCareer, locale: LocaleCode): CareerDetail {
  const item = entry.attributes || entry
  const date = item.publishedAt || item.createdAt
  const imagePath = item.cover?.formats?.medium?.url || item.cover?.formats?.small?.url || item.cover?.url

  return {
    title: item.title || '',
    slug: item.slug || '',
    department: item.department || '',
    location: item.location || '',
    type: item.type || '',
    date: date
      ? new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'vi-VN', {
          day: '2-digit',
          month: locale === 'en' ? 'short' : '2-digit',
          year: 'numeric'
        }).format(new Date(date))
      : '',
    image: absoluteStrapiUrl(imagePath) || getFallbackCareers(locale)[0]?.image || '',
    excerpt: item.excerpt || '',
    content: item.content,
    salary: item.salary
  }
}
