<script setup lang="ts">
import { articlesContent, type LocaleCode } from '~/data/site-content'
import type { ArticleSummary } from '~/types/article'

const { locale } = useI18n()
const localePath = useLocalePath()
const content = computed(() => articlesContent[locale.value as LocaleCode])
const activeFilter = ref(content.value.filters[0])
const searchTerm = ref('')
const { data } = await useAsyncData(
  () => `articles-${locale.value}`,
  () =>
    $fetch<{ source: string, posts: ArticleSummary[] }>('/api/articles', {
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
        search: 'Search articles',
        featured: 'Featured read',
        latest: 'Latest articles',
        minutes: 'min read',
        read: 'Read article',
        empty: 'No articles match this search yet.',
        guideTitle: 'Editorial focus',
        guideCopy:
          'Practical guidance for training, recovery, nutrition, and sustainable routines.',
        guideItems: ['Beginner friendly', 'Coach reviewed', 'VN/EN publishing']
      }
    : {
        search: 'Tìm bài viết',
        featured: 'Bài nổi bật',
        latest: 'Bài viết mới nhất',
        minutes: 'phút đọc',
        read: 'Đọc bài viết',
        empty: 'Chưa có bài viết phù hợp với tìm kiếm này.',
        guideTitle: 'Trọng tâm nội dung',
        guideCopy:
          'Kiến thức thực tế về tập luyện, phục hồi, dinh dưỡng và thói quen sống khỏe.',
        guideItems: ['Dễ áp dụng cho người mới', 'Định hướng bởi HLV', 'Xuất bản VN/EN']
      }
)
const filteredPosts = computed(() => {
  const defaultFilter = content.value.filters[0]
  const keyword = searchTerm.value.trim().toLowerCase()

  return posts.value.filter((post) => {
    const matchesFilter = activeFilter.value === defaultFilter || post.category === activeFilter.value
    const searchable = `${post.title} ${post.excerpt} ${post.category}`.toLowerCase()

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
    <section class="section">
      <div class="section-inner">
        <div class="article-list-header">
          <div>
            <p class="eyebrow">{{ content.eyebrow }}</p>
            <h1 class="section-title">{{ content.title }}</h1>
            <p class="section-copy">{{ content.copy }}</p>
          </div>
        </div>

        <div class="journal-toolbar">
          <div class="filter-row" aria-label="Article filters">
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

        <div class="article-board">
          <aside class="article-board-panel">
            <p class="eyebrow">{{ content.eyebrow }}</p>
            <h2>{{ labels.guideTitle }}</h2>
            <p>{{ labels.guideCopy }}</p>
            <ul>
              <li v-for="item in labels.guideItems" :key="item">{{ item }}</li>
            </ul>
          </aside>

          <div v-if="filteredPosts.length" class="article-list">
            <NuxtLink
              v-for="post in filteredPosts"
              :key="post.slug || post.title"
              class="article-list-card"
              :to="localePath(`/bai-viet/${post.slug}`)"
            >
              <img :src="post.image" :alt="post.title">
              <div class="article-list-card-body">
                <div class="article-list-card-top">
                  <span>{{ post.category }}</span>
                  <span>{{ post.date }}</span>
                  <span v-if="post.readingTime">{{ post.readingTime }} {{ labels.minutes }}</span>
                </div>
                <h2>{{ post.title }}</h2>
                <p>{{ post.excerpt }}</p>
                <strong>{{ labels.read }}</strong>
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
