<script setup lang="ts">
const route = useRoute()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()

const navItems = computed(() => [
  { label: route.path.startsWith('/en') ? 'Home' : 'Trang chủ', to: localePath('/') },
  { label: route.path.startsWith('/en') ? 'Articles' : 'Bài viết', to: localePath('/bai-viet') },
  { label: route.path.startsWith('/en') ? 'Careers' : 'Tuyển dụng', to: localePath('/tuyen-dung') }
])

const isEnglish = computed(() => route.path.startsWith('/en'))

const footerServices = computed(() =>
  isEnglish.value
    ? ['Membership', 'Group classes', 'Personal coaching', 'Recovery space']
    : ['Hội viên', 'Lớp học nhóm', 'HLV cá nhân', 'Không gian phục hồi']
)
</script>

<template>
  <div class="site-shell">
    <header class="site-header">
      <NuxtLink :to="localePath('/')" class="brand" aria-label="Wellnest Health Club">
        <span class="brand-mark">W</span>
        <span>
          <strong>Wellnest</strong>
          <small>Health Club</small>
        </span>
      </NuxtLink>

      <nav class="main-nav" aria-label="Main navigation">
        <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to">
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="locale-switcher" aria-label="Language switcher">
        <NuxtLink :to="switchLocalePath('vi')">VN</NuxtLink>
        <NuxtLink :to="switchLocalePath('en')">EN</NuxtLink>
      </div>

      <a class="header-cta" href="mailto:hello@wellnest.local">
        {{ isEnglish ? 'Contact' : 'Liên hệ' }}
      </a>
    </header>

    <main>
      <slot />
    </main>

    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <NuxtLink :to="localePath('/')" class="brand footer-brand-link" aria-label="Wellnest Health Club">
            <span class="brand-mark">W</span>
            <span>
              <strong>Wellnest</strong>
              <small>Health Club</small>
            </span>
          </NuxtLink>
          <p>
            {{
              isEnglish
                ? 'Balanced training, recovery, and everyday wellness for modern routines.'
                : 'Tập luyện, phục hồi và chăm sóc sức khỏe cân bằng cho nhịp sống hiện đại.'
            }}
          </p>
        </div>

        <div class="footer-column">
          <h2>{{ isEnglish ? 'Explore' : 'Khám phá' }}</h2>
          <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to">
            {{ item.label }}
          </NuxtLink>
        </div>

        <div class="footer-column">
          <h2>{{ isEnglish ? 'Services' : 'Dịch vụ' }}</h2>
          <span v-for="service in footerServices" :key="service">{{ service }}</span>
        </div>

        <div class="footer-column footer-contact">
          <h2>{{ isEnglish ? 'Contact' : 'Liên hệ' }}</h2>
          <a href="mailto:hello@wellnest.local">hello@wellnest.local</a>
          <a href="tel:+84000000000">+84 000 000 000</a>
          <span>24 Wellness Street, District 1</span>
          <span>{{ isEnglish ? 'Mon - Sun, 6:00 - 21:30' : 'Thứ 2 - Chủ nhật, 6:00 - 21:30' }}</span>
        </div>

        <div class="footer-newsletter">
          <h2>{{ isEnglish ? 'Wellness notes' : 'Bản tin sức khỏe' }}</h2>
          <p>
            {{
              isEnglish
                ? 'Get class updates, recovery tips, and new articles from Wellnest.'
                : 'Nhận lịch lớp mới, gợi ý phục hồi và bài viết mới từ Wellnest.'
            }}
          </p>
          <form class="newsletter-form">
            <input
              type="email"
              :placeholder="isEnglish ? 'Email address' : 'Địa chỉ email'"
              aria-label="Email address"
            >
            <button type="submit">{{ isEnglish ? 'Join' : 'Đăng ký' }}</button>
          </form>
        </div>

        <div class="footer-bottom">
          <span>© 2026 Wellnest Health Club</span>
          <div class="footer-bottom-links">
            <NuxtLink :to="localePath('/bai-viet')">
              {{ isEnglish ? 'Read articles' : 'Đọc bài viết' }}
            </NuxtLink>
            <NuxtLink :to="localePath('/tuyen-dung')">
              {{ isEnglish ? 'Open roles' : 'Vị trí tuyển dụng' }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
