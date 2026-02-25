import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Header from '../components/Header'
import UploadZone from '../components/UploadZone'

describe('Header', () => {
  it('renders logo text', () => {
    render(<Header />)
    expect(screen.getByText('Design')).toBeInTheDocument()
    expect(screen.getByText('Tutor')).toBeInTheDocument()
  })

  it('renders language switcher', () => {
    render(<Header />)
    expect(screen.getByTestId('lang-switcher')).toBeInTheDocument()
  })
})

describe('UploadZone', () => {
  it('renders upload instruction', () => {
    render(
      <UploadZone 
        onUpload={vi.fn()} 
        isLoading={false} 
        previewImage={null} 
      />
    )
    expect(screen.getByText('upload.drag')).toBeInTheDocument()
  })

  it('shows loading state', () => {
    render(
      <UploadZone 
        onUpload={vi.fn()} 
        isLoading={true} 
        previewImage={null} 
      />
    )
    expect(screen.getByText('upload.analyzing')).toBeInTheDocument()
  })

  it('shows preview image when provided', () => {
    render(
      <UploadZone 
        onUpload={vi.fn()} 
        isLoading={false} 
        previewImage="data:image/png;base64,abc123" 
      />
    )
    expect(screen.getByAltText('Preview')).toBeInTheDocument()
  })
})
