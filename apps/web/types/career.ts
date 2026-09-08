export type CareerSummary = {
  title: string
  slug: string
  department: string
  location: string
  type: string
  date: string
  image: string
  excerpt: string
  salary?: string
}

export type CareerDetail = CareerSummary & {
  content?: string
}
