import { useEffect, useState } from 'react'
import { useEnvironmentContext } from './context/EnvironmentContext'
import { useLanguage } from './i18n/LanguageContext'
import { ScanBackground } from './components/Background'
import { About } from './components/About'
import { Contact } from './components/Contact'
import { Education } from './components/Education'
import { Experience } from './components/Experience'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Loader } from './components/Loader'
import { NotFound } from './components/NotFound'
import { Safety } from './components/Safety'
import { Skills } from './components/Skills'

export default function App() {
  const { t } = useLanguage()
  const { reduced } = useEnvironmentContext()
  const [introDone, setIntroDone] = useState(false)
  const [pathname, setPathname] = useState(() => window.location.pathname)

  const notFound = pathname !== '/' && pathname !== '/index.html'

  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? 'off' : 'on'
  }, [reduced])

  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    if (reduced) return
    let cancelled = false
    let frame = 0
    let instance: { raf: (time: number) => void; destroy: () => void } | null = null

    void import('lenis').then(({ default: Lenis }) => {
      if (cancelled) return
      instance = new Lenis({ duration: 1.1, smoothWheel: true, syncTouch: false })
      const loop = (time: number) => {
        instance?.raf(time)
        frame = requestAnimationFrame(loop)
      }
      frame = requestAnimationFrame(loop)
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      instance?.destroy()
    }
  }, [reduced])

  return (
    <>
      <a className="skip-link" href="#main">{t.nav.skip}</a>
      <Loader onComplete={() => setIntroDone(true)} />
      <div inert={!introDone}>
        <ScanBackground />
        <Header />

        <main id="main" tabIndex={-1}>
          {notFound ? (
            <NotFound />
          ) : (
            <>
              <Hero start={introDone} />
              <About />
              <Skills />
              <Experience />
              <Education />
              <Safety />
              <Contact />
            </>
          )}
        </main>

        <Footer />
      </div>
    </>
  )
}
