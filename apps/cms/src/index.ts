export default {
  register() {},

  async bootstrap({ strapi }) {
    if (process.env.STRAPI_SEED !== 'true') {
      return
    }

    const count = await strapi.documents('api::article.article').count()

    if (count === 0) {
      const articles = [
        {
          locale: 'vi',
          title: 'Cách bắt đầu tập luyện mà không bị quá tải',
          slug: 'cach-bat-dau-tap-luyen-ma-khong-bi-qua-tai',
          excerpt:
            'Một lộ trình nhẹ nhàng giúp cơ thể thích nghi, giảm chấn thương và duy trì động lực lâu dài.',
          content:
            'Bắt đầu chậm, chọn lịch tập phù hợp và ưu tiên phục hồi là cách tốt nhất để duy trì sức khỏe lâu dài.',
          category: 'Tập luyện',
          publishedAt: new Date()
        },
        {
          locale: 'vi',
          title: 'Phục hồi là một phần của tiến bộ',
          slug: 'phuc-hoi-la-mot-phan-cua-tien-bo',
          excerpt:
            'Ngủ, giãn cơ và ngày tập nhẹ giúp hệ thần kinh và cơ bắp sẵn sàng cho buổi tập tiếp theo.',
          content:
            'Phục hồi tốt giúp cơ thể hấp thụ hiệu quả từ tập luyện và giảm cảm giác quá tải.',
          category: 'Phục hồi',
          publishedAt: new Date()
        },
        {
          locale: 'en',
          title: 'How to start training without burning out',
          slug: 'how-to-start-training-without-burning-out',
          excerpt:
            'A gentle path that helps your body adapt, reduces injury risk, and keeps motivation steady.',
          content:
            'Start slowly, choose a schedule that fits your life, and make recovery part of your weekly rhythm.',
          category: 'Training',
          publishedAt: new Date()
        }
      ]

      for (const article of articles) {
        await strapi.documents('api::article.article').create({
          data: article,
          status: 'published',
          locale: article.locale
        })
      }
    }

    const jobPostCount = await strapi.documents('api::job-post.job-post').count()

    if (jobPostCount > 0) {
      return
    }

    const jobPosts = [
      {
        locale: 'vi',
        title: 'Huấn luyện viên cá nhân',
        slug: 'huan-luyen-vien-ca-nhan',
        excerpt:
          'Đồng hành cùng hội viên qua đánh giá thể trạng, thiết kế chương trình tập và theo dõi tiến độ dài hạn.',
        content: [
          '## Về vị trí này',
          'Bạn sẽ trực tiếp hướng dẫn hội viên xây dựng thói quen tập luyện an toàn, phù hợp mục tiêu và thể trạng.',
          '## Công việc chính',
          'Đánh giá thể trạng, thiết kế giáo án, hướng dẫn kỹ thuật, theo dõi tiến độ và phối hợp với đội vận hành để giữ trải nghiệm hội viên ổn định.',
          '## Yêu cầu',
          'Có kinh nghiệm huấn luyện, giao tiếp tốt, tinh thần học hỏi và quan tâm đến sức khỏe bền vững.'
        ].join('\n\n'),
        department: 'Huấn luyện',
        location: 'Quận 1, TP. Hồ Chí Minh',
        type: 'Full-time',
        salary: 'Thỏa thuận theo năng lực',
        publishedAt: new Date()
      },
      {
        locale: 'vi',
        title: 'Điều phối lớp học nhóm',
        slug: 'dieu-phoi-lop-hoc-nhom',
        excerpt:
          'Sắp xếp lịch lớp, hỗ trợ HLV và đảm bảo trải nghiệm hội viên diễn ra mượt mà mỗi ngày.',
        content: [
          '## Về vị trí này',
          'Bạn sẽ là người giữ nhịp vận hành cho các lớp nhóm tại Wellnest.',
          '## Công việc chính',
          'Quản lý lịch lớp, hỗ trợ check-in, phối hợp HLV, xử lý thay đổi lịch và ghi nhận phản hồi hội viên.',
          '## Yêu cầu',
          'Cẩn thận, giao tiếp rõ ràng, biết sắp xếp công việc và yêu thích môi trường dịch vụ sức khỏe.'
        ].join('\n\n'),
        department: 'Vận hành',
        location: 'Quận 1, TP. Hồ Chí Minh',
        type: 'Part-time',
        salary: 'Theo ca',
        publishedAt: new Date()
      },
      {
        locale: 'en',
        title: 'Personal Coach',
        slug: 'personal-coach',
        excerpt:
          'Guide members through assessments, training programs, and long-term progress tracking.',
        content: [
          '## About the role',
          'You will guide members toward safe, sustainable training routines that match their goals and body condition.',
          '## What you will do',
          'Run assessments, design programs, coach movement quality, track progress, and coordinate with the operations team.',
          '## What we are looking for',
          'Coaching experience, clear communication, a learning mindset, and genuine care for sustainable wellness.'
        ].join('\n\n'),
        department: 'Coaching',
        location: 'District 1, Ho Chi Minh City',
        type: 'Full-time',
        salary: 'Negotiable by experience',
        publishedAt: new Date()
      }
    ]

    for (const jobPost of jobPosts) {
      await strapi.documents('api::job-post.job-post').create({
        data: jobPost,
        status: 'published',
        locale: jobPost.locale
      })
    }
  }
}
