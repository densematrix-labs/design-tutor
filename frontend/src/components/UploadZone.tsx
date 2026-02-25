import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useTranslation } from 'react-i18next'
import { Upload, Loader2, Image } from 'lucide-react'

interface UploadZoneProps {
  onUpload: (file: File) => void
  isLoading: boolean
  previewImage: string | null
}

export default function UploadZone({ onUpload, isLoading, previewImage }: UploadZoneProps) {
  const { t } = useTranslation()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onUpload(acceptedFiles[0])
    }
  }, [onUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
    disabled: isLoading
  })

  return (
    <div className="w-full max-w-2xl">
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
          transition-all duration-300 ease-out
          ${isDragActive 
            ? 'border-syntax-cyan bg-syntax-cyan/10 scale-[1.02]' 
            : 'border-editor-border hover:border-syntax-violet hover:bg-editor-surface/50'
          }
          ${isLoading ? 'pointer-events-none opacity-60' : ''}
        `}
      >
        <input {...getInputProps()} data-testid="file-input" />
        
        {isLoading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="w-16 h-16 text-syntax-cyan animate-spin mb-4" />
            <p className="text-lg text-editor-text font-medium">{t('upload.analyzing')}</p>
            <p className="text-sm text-editor-muted mt-2">{t('upload.wait')}</p>
          </div>
        ) : previewImage ? (
          <div className="flex flex-col items-center">
            <img 
              src={previewImage} 
              alt="Preview" 
              className="max-h-48 rounded-lg mb-4 border border-editor-border"
            />
            <p className="text-editor-muted">{t('upload.clickToChange')}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-2xl bg-editor-surface border border-editor-border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              {isDragActive ? (
                <Image className="w-10 h-10 text-syntax-cyan" />
              ) : (
                <Upload className="w-10 h-10 text-editor-muted" />
              )}
            </div>
            
            <p className="text-lg text-editor-text font-medium mb-2">
              {isDragActive ? t('upload.drop') : t('upload.drag')}
            </p>
            <p className="text-sm text-editor-muted">
              {t('upload.formats')}
            </p>
          </div>
        )}

        {/* Decorative corners */}
        <div className="absolute top-4 left-4 w-4 h-4 border-l-2 border-t-2 border-syntax-cyan/30 rounded-tl" />
        <div className="absolute top-4 right-4 w-4 h-4 border-r-2 border-t-2 border-syntax-cyan/30 rounded-tr" />
        <div className="absolute bottom-4 left-4 w-4 h-4 border-l-2 border-b-2 border-syntax-cyan/30 rounded-bl" />
        <div className="absolute bottom-4 right-4 w-4 h-4 border-r-2 border-b-2 border-syntax-cyan/30 rounded-br" />
      </div>
    </div>
  )
}
