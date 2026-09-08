<script setup lang="ts">
import type { CareerDetail } from '~/types/career'

const route = useRoute()
const { locale } = useI18n()
const localePath = useLocalePath()

const slug = computed(() => String(route.params.slug || ''))
const { data, error } = await useAsyncData(
  () => `career-${locale.value}-${slug.value}`,
  () =>
    $fetch<{ source: string, post: CareerDetail }>(`/api/careers/${slug.value}`, {
      query: { locale: locale.value }
    }),
  {
    watch: [locale, slug]
  }
)

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Career post not found' })
}

const post = computed(() => data.value?.post)
const labels = computed(() =>
  locale.value === 'en'
    ? {
        back: 'Back to careers',
        department: 'Department',
        location: 'Location',
        type: 'Employment type',
        salary: 'Compensation',
        apply: 'Apply by email',
        intro: 'Role overview'
      }
    : {
        back: 'Quay lại tuyển dụng',
        department: 'Bộ phận',
        location: 'Địa điểm',
        type: 'Hình thức',
        salary: 'Thu nhập',
        apply: 'Ứng tuyển qua email',
        intro: 'Tổng quan vị trí'
      }
)
const contentBlocks = computed(() => parseCareerContent(post.value?.content || post.value?.excerpt || ''))

useSeoMeta({
  title: () => post.value?.title || 'Careers',
  description: () => post.value?.excerpt || '',
  ogTitle: () => post.value?.title || 'Careers',
  ogDescription: () => post.value?.excerpt || '',
  ogImage: () => post.value?.image
})

type ContentBlock =
  | { type: 'paragraph', text: string }
  | { type: 'heading', text: string }

function parseCareerContent(content: string): ContentBlock[] {
  return content
    .split(/\n{2,}|\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      if (item.startsWith('### ')) {
        return { type: 'heading', text: item.replace(/^###\s+/, '') }
      }

      if (item.startsWith('## ')) {
        return { type: 'heading', text: item.replace(/^##\s+/, '') }
      }

      return { type: 'paragraph', text: item.replace(/\*\*(.*?)\*\*/g, '$1') }
    })
}
</script>

<template>
  <article v-if="post" class="career-detail">
    <section class="career-detail-hero">
      <div class="career-detail-copy">
        <NuxtLink class="article-back-link" :to="localePath('/tuyen-dung')">
          {{ labels.back }}
        </NuxtLink>
        <p class="eyebrow">{{ post.department }}</p>
        <h1>{{ post.title }}</h1>
        <p>{{ post.excerpt }}</p>
      </div>
    </section>

    <section class="career-detail-wrap">
      <aside class="career-detail-sidebar">
        <div class="career-sidebar-card">
          <span>{{ labels.department }}</span>
          <strong>{{ post.department }}</strong>
        </div>
        <div class="career-sidebar-card">
          <span>{{ labels.location }}</span>
          <strong>{{ post.location }}</strong>
        </div>
        <div class="career-sidebar-card">
          <span>{{ labels.type }}</span>
          <strong>{{ post.type }}</strong>
        </div>
        <div v-if="post.salary" class="career-sidebar-card">
          <span>{{ labels.salary }}</span>
          <strong>{{ post.salary }}</strong>
        </div>
        <a class="button career-apply" href="mailto:hello@wellnest.local">
          {{ labels.apply }}
        </a>
      </aside>

      <div class="career-detail-main">
        <img :src="post.image" :alt="post.title">
        <div class="career-prose">
          <p class="eyebrow">{{ labels.intro }}</p>
          <template v-for="block in contentBlocks" :key="`${block.type}-${block.text}`">
            <h2 v-if="block.type === 'heading'">{{ block.text }}</h2>
            <p v-else>{{ block.text }}</p>
          </template>
        </div>
      </div>
    </section>
  </article>
</template>
