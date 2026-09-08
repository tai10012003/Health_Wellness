export type LocaleCode = 'vi' | 'en'

export const homeContent = {
  vi: {
    seoTitle: 'Trang Chủ',
    hero: {
      eyebrow: 'Health & Wellness Club',
      title: 'Sống khỏe hơn mỗi ngày, theo cách cân bằng hơn.',
      copy:
        'Wellnest kết hợp hội viên, lớp học nhóm, huấn luyện cá nhân và không gian phục hồi để tạo nên một hành trình sức khỏe bền vững.',
      primary: 'Đăng ký tư vấn',
      secondary: 'Xem bài viết'
    },
    servicesTitle: 'Một hệ sinh thái chăm sóc sức khỏe thực tế',
    servicesCopy:
      'Các dịch vụ được thiết kế cho người mới bắt đầu, người tập đều đặn và cả những ai cần một lộ trình cá nhân hóa.',
    services: [
      {
        title: 'Hội viên linh hoạt',
        copy: 'Các gói hội viên phù hợp với lịch sinh hoạt, mục tiêu sức khỏe và nhu cầu trải nghiệm.'
      },
      {
        title: 'Lớp học có hướng dẫn',
        copy: 'Yoga, strength, mobility và recovery được sắp xếp theo cấp độ rõ ràng.'
      },
      {
        title: 'HLV cá nhân',
        copy: 'Đánh giá thể trạng, lên lộ trình và đồng hành để tiến bộ một cách an toàn.'
      }
    ],
    experience: {
      title: 'Từ buổi tư vấn đầu tiên đến thói quen bền vững',
      copy:
        'Mỗi hội viên bắt đầu bằng một buổi trao đổi ngắn về mục tiêu, lịch sinh hoạt và tình trạng cơ thể. Từ đó, Wellnest gợi ý lịch tập, lớp phù hợp và cách phục hồi để bạn thấy tiến bộ rõ ràng nhưng không bị áp lực.',
      imageAlt: 'Người tập đang được hướng dẫn trong một không gian wellness hiện đại',
      steps: [
        {
          label: 'Đánh giá',
          text: 'Hiểu mục tiêu, thể trạng và giới hạn hiện tại của bạn.'
        },
        {
          label: 'Lên lộ trình',
          text: 'Kết hợp lớp nhóm, HLV cá nhân và phục hồi theo lịch phù hợp.'
        },
        {
          label: 'Theo dõi',
          text: 'Điều chỉnh cường độ và thói quen để duy trì kết quả lâu dài.'
        }
      ]
    },
    metrics: [
      { value: '24+', label: 'lớp mỗi tuần' },
      { value: '12', label: 'HLV và chuyên gia' },
      { value: '2', label: 'ngôn ngữ VN/EN' },
      { value: '1:1', label: 'tư vấn cá nhân' }
    ]
  },
  en: {
    seoTitle: 'Home',
    hero: {
      eyebrow: 'Health & Wellness Club',
      title: 'Feel stronger every day with a balanced wellness routine.',
      copy:
        'Wellnest brings membership, group classes, personal training, and recovery into one calm, practical health journey.',
      primary: 'Book a consultation',
      secondary: 'Read articles'
    },
    servicesTitle: 'A practical wellness ecosystem',
    servicesCopy:
      'Our services are designed for beginners, consistent movers, and anyone who needs a more personal path.',
    services: [
      {
        title: 'Flexible membership',
        copy: 'Plans shaped around your schedule, wellness goals, and preferred experience.'
      },
      {
        title: 'Guided classes',
        copy: 'Yoga, strength, mobility, and recovery sessions organized by clear levels.'
      },
      {
        title: 'Personal coaching',
        copy: 'Assessment, programming, and coaching that helps you progress with confidence.'
      }
    ],
    experience: {
      title: 'From your first consultation to a routine that lasts',
      copy:
        'Every member starts with a short conversation about goals, schedule, and current body condition. From there, Wellnest recommends the right mix of classes, coaching, and recovery so progress feels clear without feeling forced.',
      imageAlt: 'A member receiving guidance inside a modern wellness studio',
      steps: [
        {
          label: 'Assess',
          text: 'Understand your goals, body condition, and current limits.'
        },
        {
          label: 'Plan',
          text: 'Blend group classes, personal coaching, and recovery around your week.'
        },
        {
          label: 'Adjust',
          text: 'Tune intensity and habits so your results can keep compounding.'
        }
      ]
    },
    metrics: [
      { value: '24+', label: 'weekly classes' },
      { value: '12', label: 'coaches and experts' },
      { value: '2', label: 'VN/EN languages' },
      { value: '1:1', label: 'personal consultation' }
    ]
  }
} satisfies Record<LocaleCode, unknown>

export const articlesContent = {
  vi: {
    seoTitle: 'Bài Viết',
    eyebrow: 'Wellness Journal',
    title: 'Kiến thức sức khỏe để tập luyện thông minh hơn.',
    copy:
      'Các bài viết ngắn gọn về tập luyện, phục hồi, dinh dưỡng và thói quen sống khỏe cho cộng đồng Wellnest.',
    filters: ['Tất cả', 'Tập luyện', 'Phục hồi', 'Dinh dưỡng'],
    posts: [
      {
        title: 'Cách bắt đầu tập luyện mà không bị quá tải',
        category: 'Tập luyện',
        date: '07/09/2026',
        image:
          'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=900&q=80',
        excerpt:
          'Một lộ trình nhẹ nhàng giúp cơ thể thích nghi, giảm chấn thương và duy trì động lực lâu dài.'
      },
      {
        title: 'Phục hồi là một phần của tiến bộ',
        category: 'Phục hồi',
        date: '04/09/2026',
        image:
          'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=900&q=80',
        excerpt:
          'Ngủ, giãn cơ và ngày tập nhẹ giúp hệ thần kinh và cơ bắp sẵn sàng cho buổi tập tiếp theo.'
      },
      {
        title: 'Ăn uống trước lớp yoga và strength',
        category: 'Dinh dưỡng',
        date: '30/08/2026',
        image:
          'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&q=80',
        excerpt:
          'Những lựa chọn đơn giản để có đủ năng lượng mà vẫn cảm thấy nhẹ người khi vận động.'
      }
    ]
  },
  en: {
    seoTitle: 'Articles',
    eyebrow: 'Wellness Journal',
    title: 'Health insights for smarter everyday training.',
    copy:
      'Short reads on training, recovery, nutrition, and sustainable wellness habits for the Wellnest community.',
    filters: ['All', 'Training', 'Recovery', 'Nutrition'],
    posts: [
      {
        title: 'How to start training without burning out',
        category: 'Training',
        date: 'Sep 7, 2026',
        image:
          'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=900&q=80',
        excerpt:
          'A gentle path that helps your body adapt, reduces injury risk, and keeps motivation steady.'
      },
      {
        title: 'Recovery is part of progress',
        category: 'Recovery',
        date: 'Sep 4, 2026',
        image:
          'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=900&q=80',
        excerpt:
          'Sleep, mobility, and lighter training days help your body prepare for the next session.'
      },
      {
        title: 'What to eat before yoga and strength class',
        category: 'Nutrition',
        date: 'Aug 30, 2026',
        image:
          'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&q=80',
        excerpt:
          'Simple choices for steady energy without feeling heavy while you move.'
      }
    ]
  }
} satisfies Record<LocaleCode, unknown>

export const careersContent = {
  vi: {
    seoTitle: 'Tuyển Dụng',
    eyebrow: 'Careers',
    title: 'Cùng xây dựng một cộng đồng sống khỏe có chiều sâu.',
    copy:
      'Wellnest tìm kiếm những con người tử tế, chủ động và yêu thích sức khỏe bền vững để cùng phát triển dịch vụ wellness hiện đại.',
    filters: ['Tất cả', 'Huấn luyện', 'Vận hành', 'Marketing'],
    highlights: [
      { value: '12+', label: 'đồng đội hiện tại' },
      { value: '2', label: 'ngôn ngữ làm việc' },
      { value: '6 ngày', label: 'lịch vận hành linh hoạt' }
    ],
    posts: [
      {
        title: 'Huấn luyện viên cá nhân',
        department: 'Huấn luyện',
        location: 'Quận 1, TP. Hồ Chí Minh',
        type: 'Full-time',
        date: '08/09/2026',
        image:
          'https://images.unsplash.com/photo-1571019613914-85f342c6a11e?auto=format&fit=crop&w=1000&q=82',
        excerpt:
          'Đồng hành cùng hội viên qua đánh giá thể trạng, thiết kế chương trình tập và theo dõi tiến độ dài hạn.',
        salary: 'Thỏa thuận theo năng lực'
      },
      {
        title: 'Điều phối lớp học nhóm',
        department: 'Vận hành',
        location: 'Quận 1, TP. Hồ Chí Minh',
        type: 'Part-time',
        date: '05/09/2026',
        image:
          'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1000&q=82',
        excerpt:
          'Sắp xếp lịch lớp, hỗ trợ HLV và đảm bảo trải nghiệm hội viên diễn ra mượt mà mỗi ngày.',
        salary: 'Theo ca'
      },
      {
        title: 'Content Marketing Executive',
        department: 'Marketing',
        location: 'Hybrid',
        type: 'Full-time',
        date: '01/09/2026',
        image:
          'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1000&q=82',
        excerpt:
          'Phát triển nội dung sức khỏe, bài viết, social post và chiến dịch truyền thông cho cộng đồng Wellnest.',
        salary: '12-18 triệu VND'
      }
    ]
  },
  en: {
    seoTitle: 'Careers',
    eyebrow: 'Careers',
    title: 'Help build a deeper, more sustainable wellness community.',
    copy:
      'Wellnest is looking for thoughtful, proactive people who care about modern wellness, member experience, and long-term health.',
    filters: ['All', 'Coaching', 'Operations', 'Marketing'],
    highlights: [
      { value: '12+', label: 'current teammates' },
      { value: '2', label: 'working languages' },
      { value: '6 days', label: 'flexible operations' }
    ],
    posts: [
      {
        title: 'Personal Coach',
        department: 'Coaching',
        location: 'District 1, Ho Chi Minh City',
        type: 'Full-time',
        date: 'Sep 8, 2026',
        image:
          'https://images.unsplash.com/photo-1571019613914-85f342c6a11e?auto=format&fit=crop&w=1000&q=82',
        excerpt:
          'Guide members through assessments, training programs, and long-term progress tracking.',
        salary: 'Negotiable by experience'
      },
      {
        title: 'Group Class Coordinator',
        department: 'Operations',
        location: 'District 1, Ho Chi Minh City',
        type: 'Part-time',
        date: 'Sep 5, 2026',
        image:
          'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1000&q=82',
        excerpt:
          'Coordinate class schedules, support coaches, and keep daily member experiences smooth.',
        salary: 'Shift-based'
      },
      {
        title: 'Content Marketing Executive',
        department: 'Marketing',
        location: 'Hybrid',
        type: 'Full-time',
        date: 'Sep 1, 2026',
        image:
          'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1000&q=82',
        excerpt:
          'Create wellness articles, social posts, and campaigns for the Wellnest community.',
        salary: 'Negotiable'
      }
    ]
  }
} satisfies Record<LocaleCode, unknown>
