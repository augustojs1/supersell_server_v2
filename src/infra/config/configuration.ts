export const configuration = () => ({
  NODE_ENV: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10) || 8080,
  database: {
    tag: process.env.DB_TAG,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expire_time: process.env.JWT_EXPIRE_TIME,
  },
  supersell_external_service: {
    host: process.env.SUPERSELL_EXTERNAL_SERVICE_HOST,
    port: Number(process.env.SUPERSELL_EXTERNAL_SERVICE_PORT),
  },
  aws: {
    access_key: process.env.AWS_ACCESS_KEY,
    secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    s3_bucket: process.env.AWS_S3_BUCKET,
    sns_topics: {
      order_payment: process.env.AWS_SNS_ORDER_PAYMENT,
      email_password_reset: process.env.AWS_SNS_EMAIL_PASSWORD_RESET,
      email_order_status_change: process.env.AWS_SNS_EMAIL_ORDER_STATUS_CHANGE,
      email_order_created: process.env.AWS_SNS_EMAIL_ORDER_CREATED,
      email_order_invoice: process.env.AWS_SNS_EMAIL_ORDER_INVOICE,
    },
  },
  stripe: {
    publishable_key: process.env.STRIPE_PUBLISHABLE_KEY,
    secret_key: process.env.STRIPE_SECRET_KEY,
  },
});
