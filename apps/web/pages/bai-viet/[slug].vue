<script setup lang="ts">
import type { ArticleDetail } from '~/types/article'

const route = useRoute()
const { locale } = useI18n()
const localePath = useLocalePath()

const slug = computed(() => String(route.params.slug || ''))
const { data, error } = await useAsyncData(
  () => `article-${locale.value}-${slug.value}`,
  () =>
    $fetch<{ source: string, post: ArticleDetail }>(`/api/articles/${slug.value}`, {
      query: { locale: locale.value }
    }),
  {
    watch: [locale, slug]
  }
)

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Article not found' })
}

const post = computed(() => data.value?.post)
const contentBlocks = computed(() => parseArticleContent(post.value?.content || post.value?.excerpt || ''))
const labels = computed(() =>
  locale.value === 'en'
    ? {
        back: 'Back to articles',
        category: 'Category',
        published: 'Published',
        readingTime: 'Reading time',
        minutes: 'min',
        articleInfo: 'Article info',
        note:
          'Save this article for your next training week and adjust the advice to your current body condition.'
      }
    : {
        back: 'Quay lại bài viết',
        category: 'Chuyên mục',
        published: 'Ngày đăng',
        readingTime: 'Thời gian đọc',
        minutes: 'phút',
        articleInfo: 'Thông tin bài viết',
        note:
          'Lưu lại bài viết này cho tuần tập tiếp theo và điều chỉnh theo tình trạng cơ thể hiện tại của bạn.'
      }
)

useSeoMeta({
  title: () => post.value?.title || 'Article',
  description: () => post.value?.excerpt || '',
  ogTitle: () => post.value?.title || 'Article',
  ogDescription: () => post.value?.excerpt || '',
  ogImage: () => post.value?.image
})

type ContentBlock =
  | { type: 'paragraph', text: string }
  | { type: 'image', src: string, alt: string }
  | { type: 'heading', text: string }

function parseArticleContent(content: string): ContentBlock[] {
  return content
    .split(/\n{2,}|\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const image = item.match(/^!\[(.*?)\]\((.*?)\)$/)

      if (image) {
        return {
          type: 'image',
          alt: image[1] || post.value?.title || '',
          src: image[2]
        }
      }

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
  <article v-if="post" class="article-detail">
    <section class="article-hero">
      <div class="article-hero-copy">
        <NuxtLink class="article-back-link" :to="localePath('/bai-viet')">
          {{ labels.back }}
        </NuxtLink>

        <div class="article-meta">
          <span>{{ post.category }}</span>
          <span>{{ post.date }}</span>
          <span v-if="post.readingTime">{{ post.readingTime }} {{ labels.minutes }}</span>
        </div>

        <h1>{{ post.title }}</h1>
        <p>{{ post.excerpt }}</p>
      </div>
    </section>

    <section class="article-detail-wrap">
      <aside class="article-sidebar">
        <div class="article-sidebar-intro">
          <span>{{ labels.articleInfo }}</span>
          <p>{{ labels.note }}</p>
        </div>

        <div class="article-sidebar-card">
          <span>{{ labels.category }}</span>
          <strong>{{ post.category }}</strong>
        </div>
        <div class="article-sidebar-card">
          <span>{{ labels.published }}</span>
          <strong>{{ post.date }}</strong>
        </div>
        <div v-if="post.readingTime" class="article-sidebar-card">
          <span>{{ labels.readingTime }}</span>
          <strong>{{ post.readingTime }} {{ labels.minutes }}</strong>
        </div>
      </aside>

      <div class="article-main">
        <div class="article-detail-media">
          <img :src="post.image" :alt="post.title">
        </div>

        <div class="article-content">
          <template v-for="block in contentBlocks" :key="`${block.type}-${'text' in block ? block.text : block.src}`">
            <h2 v-if="block.type === 'heading'">{{ block.text }}</h2>
            <figure v-else-if="block.type === 'image'" class="article-inline-image">
              <img :src="block.src" :alt="block.alt">
              <figcaption v-if="block.alt">{{ block.alt }}</figcaption>
            </figure>
            <p v-else>{{ block.text }}</p>
          </template>
        </div>
      </div>
    </section>
  </article>
</template>
