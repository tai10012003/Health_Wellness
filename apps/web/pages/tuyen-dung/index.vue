<script setup lang="ts">
import { careersContent, type LocaleCode } from '~/data/site-content'
import type { CareerSummary } from '~/types/career'

const { locale } = useI18n()
const localePath = useLocalePath()
const content = computed(() => careersContent[locale.value as LocaleCode])
const activeFilter = ref(content.value.filters[0])
const searchTerm = ref('')

const { data } = await useAsyncData(
  () => `careers-${locale.value}`,
  () =>
    $fetch<{ source: string, posts: CareerSummary[] }>('/api/careers', {
      query: { locale: locale.value }
    }),
  {
    watch: [locale]
  }
)

const posts = computed(() => data.value?.posts || [])
const labels = computed(() =>
  locale.value === 'en'
    ? {
        search: 'Search positions',
        allOpenings: 'Open positions',
        apply: 'View role',
        salary: 'Compensation',
        empty: 'No roles match this search yet.',
        whyTitle: 'Why join Wellnest?',
        whyCopy:
          'You will help shape a calm, practical health club where service quality matters as much as training results.'
      }
    : {
        search: 'Tìm vị trí',
        allOpenings: 'Vị trí đang tuyển',
        apply: 'Xem vị trí',
        salary: 'Thu nhập',
        empty: 'Chưa có vị trí phù hợp với tìm kiếm này.',
        whyTitle: 'Vì sao chọn Wellnest?',
        whyCopy:
          'Bạn sẽ cùng xây dựng một câu lạc bộ sức khỏe chỉn chu, nơi chất lượng dịch vụ quan trọng không kém kết quả tập luyện.'
      }
)
const filteredPosts = computed(() => {
  const defaultFilter = content.value.filters[0]
  const keyword = searchTerm.value.trim().toLowerCase()

  return posts.value.filter((post) => {
    const matchesFilter = activeFilter.value === defaultFilter || post.department === activeFilter.value
    const searchable = `${post.title} ${post.department} ${post.location} ${post.type} ${post.excerpt}`.toLowerCase()

    return matchesFilter && (!keyword || searchable.includes(keyword))
  })
})

watch(content, (nextContent) => {
  activeFilter.value = nextContent.filters[0]
  searchTerm.value = ''
})

useSeoMeta({
  title: () => content.value.seoTitle,
  description: () => content.value.copy,
  ogTitle: () => `Wellnest Health Club - ${content.value.seoTitle}`,
  ogDescription: () => content.value.copy
})
</script>

<template>
  <div>
    <section class="section careers-section">
      <div class="section-inner">
        <div class="careers-hero">
          <div>
            <p class="eyebrow">{{ content.eyebrow }}</p>
            <h1 class="section-title">{{ content.title }}</h1>
            <p class="section-copy">{{ content.copy }}</p>
          </div>

          <div class="careers-highlight-grid">
            <div v-for="item in content.highlights" :key="item.label" class="careers-highlight">
              <strong>{{ item.value }}</strong>
              <span>{{ item.label }}</span>
            </div>
          </div>
        </div>

        <div class="journal-toolbar careers-toolbar">
          <div class="filter-row" aria-label="Career filters">
            <button
              v-for="filter in content.filters"
              :key="filter"
              class="filter-chip"
              :class="{ active: activeFilter === filter }"
              type="button"
              @click="activeFilter = filter"
            >
              {{ filter }}
            </button>
          </div>

          <label class="article-search">
            <span class="sr-only">{{ labels.search }}</span>
            <input v-model="searchTerm" type="search" :placeholder="labels.search">
          </label>
        </div>

        <div class="careers-content">
          <aside class="careers-panel">
            <p class="eyebrow">{{ labels.allOpenings }}</p>
            <h2>{{ labels.whyTitle }}</h2>
            <p>{{ labels.whyCopy }}</p>
          </aside>

          <div v-if="filteredPosts.length" class="career-list">
            <NuxtLink
              v-for="post in filteredPosts"
              :key="post.slug || post.title"
              class="career-card"
              :to="localePath(`/tuyen-dung/${post.slug}`)"
            >
              <img :src="post.image" :alt="post.title">
              <div class="career-card-body">
                <div class="career-card-top">
                  <span>{{ post.department }}</span>
                  <span>{{ post.type }}</span>
                </div>
                <h2>{{ post.title }}</h2>
                <p>{{ post.excerpt }}</p>
                <div class="career-card-bottom">
                  <span>{{ post.location }}</span>
                  <span v-if="post.salary">{{ labels.salary }}: {{ post.salary }}</span>
                  <strong>{{ labels.apply }}</strong>
                </div>
              </div>
            </NuxtLink>
          </div>

          <div v-else class="article-empty">
            {{ labels.empty }}
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
