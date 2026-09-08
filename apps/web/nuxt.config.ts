export default defineNuxtConfig({
  compatibilityDate: '2026-09-07',
  devtools: { enabled: true },
  modules: ['@nuxtjs/i18n'],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      titleTemplate: '%s | Wellnest Health Club',
      meta: [
        {
          name: 'description',
          content:
            'Wellnest Health Club is a bilingual Health & Wellness brand website built with Nuxt.'
        }
      ]
    }
  },
  runtimeConfig: {
    strapiApiToken: process.env.NUXT_STRAPI_API_TOKEN,
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      strapiUrl: process.env.NUXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
    }
  },
  i18n: {
    strategy: 'prefix',
    defaultLocale: 'vi',
    locales: [
      { code: 'vi', language: 'vi-VN', name: 'Tieng Viet' },
      { code: 'en', language: 'en-US', name: 'English' }
    ]
  }
})
