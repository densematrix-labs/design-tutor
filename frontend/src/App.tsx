import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Header from './components/Header'
import UploadZone from './components/UploadZone'
import TutorialDisplay from './components/TutorialDisplay'
import { analyzDesign, TutorialResult } from './lib/api'

function App() {
  const { t, i18n } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<TutorialResult | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const handleUpload = async (file: File) => {
    setIsLoading(true)
    setError(null)
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => setPreviewImage(e.target?.result as string)
    reader.readAsDataURL(file)
    
    try {
      const tutorial = await analyzDesign(file, i18n.language)
      setResult(tutorial)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('error.unknown')
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setResult(null)
    setPreviewImage(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-editor-bg">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {!result ? (
          <div className="flex flex-col items-center">
            {/* Hero */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="text-syntax-cyan font-mono">&lt;</span>
                {t('hero.title')}
                <span className="text-syntax-cyan font-mono">/&gt;</span>
              </h1>
              <p className="text-xl text-editor-muted max-w-2xl mx-auto">
                {t('hero.subtitle')}
              </p>
            </div>

            {/* Upload Zone */}
            <UploadZone 
              onUpload={handleUpload} 
              isLoading={isLoading}
              previewImage={previewImage}
            />

            {/* Error */}
            {error && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 max-w-xl">
                {error}
              </div>
            )}

            {/* Features */}
            <div className="mt-16 grid md:grid-cols-3 gap-6 w-full max-w-4xl">
              <FeatureCard
                icon="📸"
                title={t('features.upload.title')}
                description={t('features.upload.description')}
              />
              <FeatureCard
                icon="🤖"
                title={t('features.analyze.title')}
                description={t('features.analyze.description')}
              />
              <FeatureCard
                icon="📝"
                title={t('features.learn.title')}
                description={t('features.learn.description')}
              />
            </div>
          </div>
        ) : (
          <TutorialDisplay 
            result={result} 
            previewImage={previewImage}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-editor-border mt-16 py-8 text-center text-editor-muted">
        <p className="font-mono text-sm">
          <span className="text-syntax-cyan">{'<'}</span>
          Design Tutor
          <span className="text-syntax-cyan">{' />'}</span>
          {' '} — {t('footer.tagline')}
        </p>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="p-6 bg-editor-surface border border-editor-border rounded-xl hover:border-syntax-cyan/50 transition-colors">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-editor-text mb-2">{title}</h3>
      <p className="text-editor-muted text-sm">{description}</p>
    </div>
  )
}

export default App
