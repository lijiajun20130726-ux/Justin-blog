// 上传文件基础路径（生产环境指向后端域名）
export const uploadsUrl = import.meta.env.VITE_UPLOADS_URL || ''

export function getUploadUrl(path: string): string {
  if (!path) return ''
  return `${uploadsUrl}${path}`
}
