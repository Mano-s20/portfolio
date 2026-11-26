import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useLanguage } from '../i18n/LanguageContext'
import { useEnvironmentContext } from '../context/EnvironmentContext'

interface Props {
  onComplete: () => void
}

export function Loader({ onComplete }: Props) {
  const { t } = useLanguage()
  const { reduced } = useEnvironmentContext()
  const [count, setCount] = useState(0)
  const [visible, setVisible] = useState(true)

  const finish = () => {
    setCount(100)
    setVisible(false)
  }

  useEffect(() => {
    if (reduced) {
      finish()
      return
    }
    const step = 80
    let value = 0
    const timer = window.setInterval(() => {
      value = Math.min(100, value + 10)
      setCount(value)
      if (value >= 100) {
        window.clearInterval(timer)
        window.setTimeout(() => setVisible(false), 160)
      }
    }, step)
    return () => window.clearInterval(timer)
  }, [reduced])

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {visible && (
        <motion.div
          className="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.24, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="mono-label loader-flicker">{t.loader.init}</p>
          <div className="loader-bar" aria-hidden="true">
            <span />
          </div>
          <p className="loader-readout" role="status">
            {count >= 100
              ? t.loader.name
              : `${count < 30 ? t.loader.calibrating : t.loader.scanning} ${String(count).padStart(3, '0')}`}
          </p>
          <button type="button" className="btn btn-secondary" onClick={finish}>
            {t.loader.skip}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
