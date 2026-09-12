export default ({ env }) => {
  const bucket = env('AWS_BUCKET')
  const region = env('AWS_REGION', 'ap-southeast-1')
  const s3BaseUrl = env('AWS_S3_BASE_URL', '')
  const s3Host = bucket ? `${bucket}.s3.${region}.amazonaws.com` : ''
  const mediaSources = [
    "'self'",
    'data:',
    'blob:',
    'https://market-assets.strapi.io',
    s3Host ? `https://${s3Host}` : '',
    s3BaseUrl
  ].filter(Boolean)
  return [
    'strapi::logger',
    'strapi::errors',
    {
      name: 'strapi::security',
      config: {
        contentSecurityPolicy: {
          useDefaults: true,
          directives: {
            'connect-src': ["'self'", 'https:'],
            'img-src': mediaSources,
            'media-src': mediaSources,
            upgradeInsecureRequests: null
          }
        }
      }
    },
    'strapi::cors',
    'strapi::poweredBy',
    'strapi::query',
    'strapi::body',
    'strapi::session',
    'strapi::favicon',
    'strapi::public'
  ]
}
