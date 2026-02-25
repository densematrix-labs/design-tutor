import { useTranslation } from 'react-i18next'
import { Code2, Globe } from 'lucide-react'

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
]

export default function Header() {
  const { i18n } = useTranslation()

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0]

  return (
    <header className="border-b border-editor-border bg-editor-surface/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-6xl">
        <div className="flex items-center gap-2">
          <Code2 className="w-8 h-8 text-syntax-cyan" />
          <span className="font-mono font-bold text-xl">
            <span className="text-syntax-violet">Design</span>
            <span className="text-editor-text">Tutor</span>
          </span>
        </div>

        {/* Language Selector */}
        <div className="relative group">
          <button 
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-editor-border/50 transition-colors"
            aria-label="Select language"
            data-testid="lang-switcher"
          >
            <Globe className="w-4 h-4 text-editor-muted" />
            <span>{currentLang.flag}</span>
            <span className="text-sm text-editor-muted hidden sm:inline">{currentLang.name}</span>
          </button>

          <div className="absolute right-0 top-full mt-1 bg-editor-surface border border-editor-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[160px]">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => i18n.changeLanguage(lang.code)}
                className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-editor-border/50 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                  lang.code === i18n.language ? 'text-syntax-cyan bg-syntax-cyan/10' : 'text-editor-text'
                }`}
              >
                <span>{lang.flag}</span>
                <span className="text-sm">{lang.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
