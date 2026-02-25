import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { ArrowLeft, Clock, Gauge, Layers, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { TutorialResult } from '../lib/api'

interface TutorialDisplayProps {
  result: TutorialResult
  previewImage: string | null
  onReset: () => void
}

export default function TutorialDisplay({ result, previewImage, onReset }: TutorialDisplayProps) {
  const { t } = useTranslation()

  return (
    <div className="grid lg:grid-cols-[300px_1fr] gap-8">
      {/* Sidebar */}
      <aside className="lg:sticky lg:top-24 lg:self-start space-y-6">
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-editor-muted hover:text-syntax-cyan transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('tutorial.newAnalysis')}
        </button>

        {/* Preview Image */}
        {previewImage && (
          <div className="rounded-xl overflow-hidden border border-editor-border">
            <img src={previewImage} alt="Design" className="w-full" />
          </div>
        )}

        {/* Stats */}
        <div className="space-y-3">
          <StatCard
            icon={<Clock className="w-5 h-5" />}
            label={t('tutorial.estimatedTime')}
            value={result.estimated_time}
          />
          <StatCard
            icon={<Gauge className="w-5 h-5" />}
            label={t('tutorial.difficulty')}
            value={result.estimated_difficulty}
          />
          <StatCard
            icon={<Layers className="w-5 h-5" />}
            label={t('tutorial.components')}
            value={`${result.components_detected.length} ${t('tutorial.detected')}`}
          />
        </div>

        {/* Components List */}
        <div className="bg-editor-surface border border-editor-border rounded-xl p-4">
          <h3 className="font-mono text-sm text-syntax-violet mb-3">{t('tutorial.componentsFound')}</h3>
          <ul className="space-y-2">
            {result.components_detected.slice(0, 8).map((comp, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-editor-muted">
                <span className="text-syntax-cyan font-mono">→</span>
                <span className="truncate">{comp}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <main className="bg-editor-surface border border-editor-border rounded-2xl p-8">
        <div className="tutorial-content prose prose-invert max-w-none">
          <ReactMarkdown
            components={{
              code({ className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '')
                const codeString = String(children).replace(/\n$/, '')
                
                if (match) {
                  return (
                    <CodeBlock language={match[1]} code={codeString} />
                  )
                }
                
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              }
            }}
          >
            {result.tutorial}
          </ReactMarkdown>
        </div>
      </main>
    </div>
  )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 bg-editor-surface border border-editor-border rounded-lg p-3">
      <div className="text-syntax-cyan">{icon}</div>
      <div>
        <div className="text-xs text-editor-muted">{label}</div>
        <div className="font-medium text-editor-text">{value}</div>
      </div>
    </div>
  )
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group my-4">
      <div className="absolute top-2 right-2 flex items-center gap-2 z-10">
        <span className="text-xs text-editor-muted font-mono bg-editor-bg/50 px-2 py-1 rounded">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="p-1.5 rounded bg-editor-bg/50 hover:bg-editor-border transition-colors"
          title="Copy code"
        >
          {copied ? (
            <Check className="w-4 h-4 text-syntax-green" />
          ) : (
            <Copy className="w-4 h-4 text-editor-muted" />
          )}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          borderRadius: '0.75rem',
          padding: '1.5rem',
          paddingTop: '2.5rem',
          fontSize: '0.875rem',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}
