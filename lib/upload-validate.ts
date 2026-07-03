// Client-side upload validation so users get an instant, friendly message
// (allowed types + size) instead of a raw server error after uploading.

export type UploadRule = { types: string[]; label: string; maxMB: number }

export const UPLOAD_RULES = {
  // Teacher task submissions
  submission: {
    types: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg", "image/jpg", "image/png", "image/webp",
      "video/mp4", "video/quicktime", "video/webm",
    ],
    label: "PDF, Word (.doc, .docx), image (.jpg, .png, .webp), or video (.mp4, .mov, .webm)",
    maxMB: 50,
  },
  // Admin faculty photo
  facultyImage: {
    types: ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"],
    label: "image (.jpg, .png, .webp, .gif)",
    maxMB: 5,
  },
  // Admin LMS task attachment
  taskDoc: {
    types: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg", "image/jpg", "image/png", "image/webp",
    ],
    label: "PDF, Word (.doc, .docx), or image (.jpg, .png, .webp)",
    maxMB: 20,
  },
} as const satisfies Record<string, UploadRule>

/**
 * Returns a human-friendly error message if the file is invalid, or null if OK.
 * Type check is skipped when the browser can't determine the MIME type (empty
 * file.type) so valid files aren't wrongly rejected — the server still guards it.
 */
export function checkFile(file: File, rule: UploadRule): string | null {
  if (file.type && !rule.types.includes(file.type)) {
    return `Unsupported file type "${file.type || file.name}".\n\nPlease upload only: ${rule.label}.`
  }
  if (file.size > rule.maxMB * 1024 * 1024) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1)
    return `This file is too large (${sizeMB} MB).\n\nPlease upload a file smaller than ${rule.maxMB} MB.`
  }
  return null
}
