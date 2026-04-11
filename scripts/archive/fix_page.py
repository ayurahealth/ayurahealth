import re

with open('app/page.tsx', 'r') as f:
    text = f.read()

# Fix duplicates
text = text.replace("""import dynamic from 'next/dynamic'

const WebGLBackground = dynamic(() => import('../components/WebGLBackground'), { 
  ssr: false,
  loading: () => <div style={{ position: 'absolute', inset: 0, background: '#020504' }} />
})

import dynamic from 'next/dynamic'

const WebGLBackground = dynamic(() => import('../components/WebGLBackground'), { 
  ssr: false,
  loading: () => <div style={{ position: 'absolute', inset: 0, background: '#020504' }} />
})""", """import dynamic from 'next/dynamic'

const WebGLBackground = dynamic(() => import('../components/WebGLBackground'), { 
  ssr: false,
  loading: () => <div style={{ position: 'absolute', inset: 0, background: '#020504' }} />
})""")

# Remove the `.glow` elements in hero
glows = """        {/* Ambient glows */}
        <div className="glow" style={{ top: '-15%', left: '50%', transform: 'translateX(-50%)', width: 1200, height: 900, background: 'radial-gradient(ellipse, rgba(26,77,46,0.32) 0%, rgba(106,191,138,0.05) 40%, transparent 65%)' }} />
        <div className="glow" style={{ top: '30%', right: '-20%', width: 600, height: 600, background: 'radial-gradient(ellipse, rgba(201,168,76,0.08) 0%, transparent 70%)' }} />
        <div className="glow" style={{ bottom: '5%', left: '-15%', width: 500, height: 500, background: 'radial-gradient(ellipse, rgba(45,122,69,0.1) 0%, transparent 70%)' }} />"""

text = text.replace(glows, "        <WebGLBackground />")

with open('app/page.tsx', 'w') as f:
    f.write(text)
