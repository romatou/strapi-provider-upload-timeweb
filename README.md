# Strapi Provider Upload Timeweb S3

Provider for Strapi upload plugin to use [Timeweb S3 storage](https://timeweb.cloud/services/s3-storage). Uses AWS SDK v3. Also supports private buckets Could be used with most S3 storage providers that support AWS SDK. Just change the endpoint to the url given by your provider. For more information on how to setup providers in Strapi, visit this [link](https://docs.strapi.io/dev-docs/providers#creating-providers).

## Installation

```
npm i strapi-provider-upload-timeweb
yarn add strapi-provider-upload-timeweb
```

[GitHub](https://github.com/romatou/strapi-provider-upload-timeweb)

[NPM package page](https://www.npmjs.com/package/strapi-provider-upload-timeweb)

## Configuration

1. Add variables to `.env` file:

```
# Required
S3_ACCESS_KEY=access_key
S3_SECRET_KEY=your_secret_access_key
S3_BUCKET=bucket_name

# Optional
S3_URL=https://custom.domain
S3_REGION=ru-1
S3_PRIVATE=true
```

2. Add configuration options in `config/plugins`

```TypeScript
// module.exports = ({ env }) => ({

export default ({ env }) => ({
 upload: {
  config: {
   provider: 'strapi-provider-upload-timeweb',
   providerOptions: {
		key: env('S3_ACCESS_KEY'),
		secret: env('S3_SECRET_KEY'),
		endpoint: env('S3_URL'),
		region: env('S3_REGION'),
		bucket: env('S3_BUCKET'),
		private: env('S3_PRIVATE', false)
	 },
  },
 },
})
```
