import { useEffect } from 'react'
import { MotionConfig } from 'motion/react'
import { copies } from './copy.js'
import { CopyContext, locale } from './copyContext.js'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Problem from './components/Problem.jsx'
import Answer from './components/Answer.jsx'
import FeatureTime from './components/FeatureTime.jsx'
import FeatureLeave from './components/FeatureLeave.jsx'
import FeatureDocs from './components/FeatureDocs.jsx'
import BeforeAfter from './components/BeforeAfter.jsx'
import Audience from './components/Audience.jsx'
import Proof from './components/Proof.jsx'
import Future from './components/Future.jsx'
import Pricing from './components/Pricing.jsx'
import Faq from './components/Faq.jsx'
import Close from './components/Close.jsx'
import Footer from './components/Footer.jsx'
import WhatsAppFab from './components/WhatsAppFab.jsx'

export default function App() {
  const copy = copies[locale]
  useEffect(() => {
    document.documentElement.lang = copy.meta.lang
    document.title = copy.meta.title
    const desc = document.querySelector('meta[name="description"]')
    if (desc) desc.setAttribute('content', copy.meta.description)
  }, [copy])
  return (
    <CopyContext.Provider value={copy}>
      <MotionConfig reducedMotion="user">
        <Header />
        <main>
          <Hero />
          <Problem />
          <Answer />
          <FeatureTime />
          <FeatureLeave />
          <FeatureDocs />
          <BeforeAfter />
          <Audience />
          <Proof />
          <Future />
          <Pricing />
          <Faq />
          <Close />
        </main>
        <Footer />
        <WhatsAppFab />
      </MotionConfig>
    </CopyContext.Provider>
  )
}
