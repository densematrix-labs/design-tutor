import { describe, it, expect, vi, beforeEach } from 'vitest'
import { analyzDesign } from '../lib/api'

describe('API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('handles successful response', async () => {
    const mockResponse = {
      tutorial: '# Tutorial\n\nStep 1: ...',
      components_detected: ['Header', 'Button'],
      estimated_difficulty: 'Beginner',
      estimated_time: '30 minutes'
    }

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    })

    const file = new File(['test'], 'test.png', { type: 'image/png' })
    const result = await analyzDesign(file, 'en')

    expect(result).toEqual(mockResponse)
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/v1/tutor/analyze',
      expect.objectContaining({
        method: 'POST',
      })
    )
  })

  it('handles string error detail', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ detail: 'Server error' })
    })

    const file = new File(['test'], 'test.png', { type: 'image/png' })
    await expect(analyzDesign(file, 'en')).rejects.toThrow('Server error')
  })

  it('handles object error detail with error field', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ 
        detail: { error: 'Invalid image format', code: 'INVALID_FORMAT' }
      })
    })

    const file = new File(['test'], 'test.png', { type: 'image/png' })
    
    try {
      await analyzDesign(file, 'en')
    } catch (e) {
      expect((e as Error).message).toBe('Invalid image format')
      expect((e as Error).message).not.toContain('[object Object]')
    }
  })

  it('handles object error detail with message field', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ 
        detail: { message: 'File too large' }
      })
    })

    const file = new File(['test'], 'test.png', { type: 'image/png' })
    await expect(analyzDesign(file, 'en')).rejects.toThrow('File too large')
  })

  it('handles json parse failure', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.reject(new Error('Invalid JSON'))
    })

    const file = new File(['test'], 'test.png', { type: 'image/png' })
    await expect(analyzDesign(file, 'en')).rejects.toThrow('Request failed')
  })
})
