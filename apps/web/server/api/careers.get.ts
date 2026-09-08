import { absoluteStrapiUrl, fetchFromStrapi } from '../utils/strapi'
import { getFallbackCareers } from '../utils/career-fallback'
import type { LocaleCode } from '~/data/site-content'
import type { CareerSummary } from '~/types/career'

type StrapiMedia = {
  url?: string
  formats?: {
    medium?: { url?: string }
    small?: { url?: string }
  }
}

type StrapiCareer = {
  title?: string
  slug?: string
  department?: string
  location?: string
  type?: string
  excerpt?: string
  salary?: string
  publishedAt?: string
  createdAt?: string
  cover?: StrapiMedia | { data?: { attributes?: StrapiMedia } }
  attributes?: Omit<StrapiCareer, 'attributes'>
}

type StrapiListResponse = {
  data?: StrapiCareer[]
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const locale = query.locale === 'en' ? 'en' : 'vi'

  try {
    const response = await fetchFromStrapi<StrapiListResponse>({
      path: '/api/job-posts',
      query: {
        locale,
        populate: 'cover',
        sort: 'publishedAt:desc',
        'pagination[pageSize]': 12
      }
    })

    const posts = (response.data || []).map((entry) => mapCareer(entry, locale))

    return {
      source: 'strapi',
      posts
    }
  } catch {
    return {
      source: 'fallback',
      posts: getFallbackCareers(locale)
    }
  }
})

function mapCareer(entry: StrapiCareer, locale: LocaleCode): CareerSummary {
  const item = entry.attributes || entry
  const cover = normalizeCover(item.cover)
  const date = item.publishedAt || item.createdAt

  return {
    title: item.title || '',
    slug: item.slug || '',
    department: item.department || '',
    location: item.location || '',
    type: item.type || '',
    date: formatCareerDate(date, locale),
    image:
      absoluteStrapiUrl(cover?.formats?.medium?.url || cover?.formats?.small?.url || cover?.url) ||
      getFallbackCareers(locale)[0]?.image ||
      '',
    excerpt: item.excerpt || '',
    salary: item.salary
  }
}

function normalizeCover(cover: StrapiCareer['cover']): StrapiMedia | undefined {
  if (!cover) {
    return undefined
  }

  if ('data' in cover) {
    return cover.data?.attributes
  }

  return cover
}

function formatCareerDate(value: string | undefined, locale: LocaleCode): string {
  if (!value) {
    return ''
  }

  return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'vi-VN', {
    day: '2-digit',
    month: locale === 'en' ? 'short' : '2-digit',
    year: 'numeric'
  }).format(new Date(value))
}
