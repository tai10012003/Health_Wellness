<script setup lang="ts">
import { homeContent, articlesContent, type LocaleCode } from '~/data/site-content'
import type { ArticleSummary } from '~/types/article'

const { locale } = useI18n()
const localePath = useLocalePath()

const content = computed(() => homeContent[locale.value as LocaleCode])
const { data } = await useAsyncData(
  () => `featured-articles-${locale.value}`,
  () =>
    $fetch<{ source: string, posts: ArticleSummary[] }>('/api/articles', {
      query: { locale: locale.value }
    }),
  {
    watch: [locale]
  }
)
const featuredPosts = computed(
  () => data.value?.posts.slice(0, 3) || articlesContent[locale.value as LocaleCode].posts.slice(0, 3)
)

useSeoMeta({
  title: () => content.value.seoTitle,
  description: () => content.value.hero.copy,
  ogTitle: () => `Wellnest Health Club - ${content.value.seoTitle}`,
  ogDescription: () => content.value.hero.copy
})
</script>

<template>
  <div>
    <section class="hero">
      <div class="hero-inner">
        <p class="eyebrow">{{ content.hero.eyebrow }}</p>
        <h2>{{ content.hero.title }}</h2>
        <p>{{ content.hero.copy }}</p>
        <div class="button-row">
          <a class="button" href="mailto:hello@wellnest.local">{{ content.hero.primary }}</a>
          <NuxtLink class="button secondary" :to="localePath('/bai-viet')">
            {{ content.hero.secondary }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="section section-services">
      <div class="section-inner">
        <p class="eyebrow">Services</p>
        <h2 class="section-title">{{ content.servicesTitle }}</h2>
        <p class="section-copy">{{ content.servicesCopy }}</p>

        <div class="service-grid">
          <article v-for="service in content.services" :key="service.title" class="panel">
            <h3>{{ service.title }}</h3>
            <p>{{ service.copy }}</p>
          </article>
        </div>

        <div class="experience-band">
          <div class="experience-copy">
            <p class="eyebrow">{{ locale === 'en' ? 'Member Journey' : 'Hành trình hội viên' }}</p>
            <h2>{{ content.experience.title }}</h2>
            <p>{{ content.experience.copy }}</p>
          </div>

          <div class="experience-media">
            <img
              src="https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=900&q=85"
              :alt="content.experience.imageAlt"
            >
          </div>

          <div class="journey-steps">
            <article v-for="step in content.experience.steps" :key="step.label" class="journey-step">
              <span>{{ step.label }}</span>
              <p>{{ step.text }}</p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="section section-stats">
      <div class="section-inner">
        <div class="metrics-grid">
          <div v-for="metric in content.metrics" :key="metric.label" class="metric">
            <strong>{{ metric.value }}</strong>
            <span>{{ metric.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="section section-journal">
      <div class="section-inner">
        <div class="home-journal-header">
          <div>
            <p class="eyebrow">Journal</p>
            <h2 class="section-title">
              {{ locale === 'en' ? 'Latest wellness reads' : 'Bài viết mới nhất' }}
            </h2>
          </div>
        </div>

        <div class="article-grid">
          <NuxtLink
            v-for="post in featuredPosts"
            :key="post.slug || post.title"
            class="article-card"
            :to="localePath(`/bai-viet/${post.slug}`)"
          >
            <img :src="post.image" :alt="post.title">
            <div class="article-card-body">
              <div class="article-meta">
                <span>{{ post.category }}</span>
                <span>{{ post.date }}</span>
              </div>
              <h3>{{ post.title }}</h3>
              <p>{{ post.excerpt }}</p>
            </div>
          </NuxtLink>
        </div>

        <div class="home-journal-cta">
          <NuxtLink class="button secondary" :to="localePath('/bai-viet')">
            {{ locale === 'en' ? 'View all articles' : 'Xem tất cả bài viết' }}
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
