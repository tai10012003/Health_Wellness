export default ({ env }) => {
  const s3Bucket = env('AWS_BUCKET')
  if (!s3Bucket) {
    return {}
  }
  const acl = env('AWS_ACL', undefined)
  return {
    upload: {
      config: {
        provider: 'aws-s3',
        providerOptions: {
          baseUrl: env('AWS_S3_BASE_URL', undefined),
          rootPath: env('AWS_S3_ROOT_PATH', 'uploads'),
          s3Options: {
            credentials: {
              accessKeyId: env('AWS_ACCESS_KEY_ID'),
              secretAccessKey: env('AWS_SECRET_ACCESS_KEY', env('AWS_ACCESS_SECRET'))
            },
            region: env('AWS_REGION', 'ap-southeast-1'),
            params: {
              Bucket: s3Bucket,
              ...(acl ? { ACL: acl } : {})
            }
          }
        },
        actionOptions: {
          upload: {},
          uploadStream: {},
          delete: {}
        }
      }
    }
  }
}
