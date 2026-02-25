export interface TutorialResult {
  tutorial: string
  components_detected: string[]
  estimated_difficulty: string
  estimated_time: string
}

const API_BASE = import.meta.env.PROD ? '' : ''

export async function analyzDesign(file: File, language: string): Promise<TutorialResult> {
  const formData = new FormData()
  formData.append('image', file)
  formData.append('language', language)

  const response = await fetch(`${API_BASE}/api/v1/tutor/analyze`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({ detail: 'Request failed' }))
    // Handle both string and object error details
    const errorMessage = typeof data.detail === 'string' 
      ? data.detail 
      : data.detail?.error || data.detail?.message || 'Request failed'
    throw new Error(errorMessage)
  }

  return response.json()
}
