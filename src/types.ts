import {ReadStream} from 'fs'

export interface StrapiUploadParams {
	key: string
	secret: string
	endpoint: string
	region: string
	bucket: string
	private?: boolean
}

export interface File {
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
