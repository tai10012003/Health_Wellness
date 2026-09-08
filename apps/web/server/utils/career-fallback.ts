import { careersContent, type LocaleCode } from '~/data/site-content'
import type { CareerSummary } from '~/types/career'

export function getFallbackCareers(locale: LocaleCode): CareerSummary[] {
  return careersContent[locale].posts.map((post) => ({
    title: post.title,
    slug: slugify(post.title),
    department: post.department,
    location: post.location,
    type: post.type,
    date: post.date,
    image: post.image,
    excerpt: post.excerpt,
    salary: post.salary
  }))
}

export function getFallbackCareerContent(locale: LocaleCode, title: string): string {
  if (locale === 'en') {
    return [
      `## About the role`,
      `${title} is part of the team that shapes how members experience Wellnest every day. You will work closely with coaches, operations, and content teams to keep the service thoughtful, consistent, and practical.`,
      `## What you will do`,
      `Plan weekly work, communicate clearly with the team, support member experience, and improve small details that make the club feel reliable.`,
      `## What we are looking for`,
      `A proactive mindset, strong communication, attention to detail, and genuine interest in health and wellness.`
    ].join('\n\n')
  }

  return [
    `## Về vị trí này`,
    `${title} là một phần trong đội ngũ tạo nên trải nghiệm Wellnest mỗi ngày. Bạn sẽ phối hợp với HLV, vận hành và nội dung để giữ dịch vụ chỉn chu, nhất quán và thực tế.`,
    `## Công việc chính`,
    `Lên kế hoạch công việc hằng tuần, giao tiếp rõ ràng với đội ngũ, hỗ trợ trải nghiệm hội viên và cải thiện những chi tiết nhỏ giúp câu lạc bộ vận hành tin cậy hơn.`,
    `## Chúng tôi tìm kiếm`,
    `Tinh thần chủ động, giao tiếp tốt, chú ý chi tiết và thật sự quan tâm đến sức khỏe, tập luyện và wellness.`
  ].join('\n\n')
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
