import {Upload} from '@aws-sdk/lib-storage'
import {
	S3Client,
	DeleteObjectCommand,
	GetObjectCommand,
} from '@aws-sdk/client-s3'
import {getSignedUrl} from '@aws-sdk/s3-request-presigner'
import {ReadStream} from 'fs'

interface StrapiUploadParams {
	key: string
	secret: string
	endpoint: string
	region: string
	bucket: string
	private?: boolean
}

interface File {
	name: string
	alternativeText?: string
	caption?: string
	width?: number
	height?: number
	formats?: Record<string, unknown>
	hash: string
	ext?: string
	mime: string
	size: number
	url: string
	previewUrl?: string
	path?: string
	provider?: string
	provider_metadata?: Record<string, unknown>
	stream?: ReadStream
	buffer?: Buffer
}

export = {
	init(providerOptions: StrapiUploadParams) {
		const {...config} = providerOptions

		const getFileKey = (file: File) => `${file.hash}${file.ext}`

		const getUrl = (file: File) =>
			`${config.endpoint}/${config.bucket}/${file.url}`

		const s3Client = new S3Client({
			endpoint: config.endpoint || 'https://s3.timeweb.com',
			region: config.region || 'ru-1',
			forcePathStyle: true,
			credentials: {
				accessKeyId: config.key,
				secretAccessKey: config.secret,
			},
			apiVersion: 'latest',
		})

		return {
			async upload(file: File) {
				try {
					await new Upload({
						client: s3Client,
						params: {
							Bucket: config.bucket,
							Key: getFileKey(file),
							Body: file.buffer,
							ContentType: file.mime,
						},
					}).done()

					file.url = getUrl(file)
				} catch (e) {
					throw e
				}
			},

			async uploadStream(file: File) {
				try {
					await new Upload({
						client: s3Client,
						params: {
							Bucket: config.bucket,
							Key: getFileKey(file),
							Body: file.stream,
							ContentType: file.mime,
						},
					}).done()

					file.url = getUrl(file)
				} catch (e) {
					throw e
				}
			},

			async delete(file: File) {
				try {
					await s3Client.send(
						new DeleteObjectCommand({
							Bucket: config.bucket,
							Key: getFileKey(file),
						})
					)
				} catch (e) {
					throw e
				}
			},

			async checkFileSize(file: File, {sizeLimit}) {},

			async getSignedUrl(file: File) {
				const object = new GetObjectCommand({
					Bucket: config.bucket,
					Key: getFileKey(file),
				})
				const signedUrl = await getSignedUrl(s3Client, object, {
					expiresIn: 3600,
				})
				return {url: signedUrl}
			},

			async isPrivate() {
				return config.private || false
			},
		}
	},
}
