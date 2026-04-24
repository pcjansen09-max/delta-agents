'use client'
import { useEffect, useRef } from 'react'

export default function MeshBackground() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    let W = 0, H = 0
    let mouse = { x: -999, y: -999 }
    let pts: { x: number; y: number; vx: number; vy: number; r: number; ox: number; oy: number }[] = []
    let raf: number

    function resize() {
      W = canvas.width = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
      pts = Array.from({ length: 20 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 2 + 1,
        ox: 0, oy: 0,
      }))
    }

    function draw() {
      ctx.clearRect(0, 0, W, H)
      pts.forEach(p => {
        const dx = mouse.x - p.x, dy = mouse.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const pull = Math.max(0, 1 - dist / 200)
        p.ox += (dx * pull * 0.05 - p.ox) * 0.08
        p.oy += (dy * pull * 0.05 - p.oy) * 0.08
        p.x += p.vx + p.ox
        p.y += p.vy + p.oy
        if (p.x < 0 || p.x > W) p.vx *= -1
        if (p.y < 0 || p.y > H) p.vy *= -1
      })
      for (let a = 0; a < pts.length; a++) {
        for (let b = a + 1; b < pts.length; b++) {
          const dx = pts[a].x - pts[b].x, dy = pts[a].y - pts[b].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 170) {
            ctx.beginPath()
            ctx.moveTo(pts[a].x, pts[a].y)
            ctx.lineTo(pts[b].x, pts[b].y)
            ctx.strokeStyle = `rgba(27,79,216,${(1 - d / 170) * 0.07})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
        ctx.beginPath()
        ctx.arc(pts[a].x, pts[a].y, pts[a].r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(27,79,216,0.15)'
        ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)

    const parent = canvas.parentElement
    const onMouseMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      mouse = { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    parent?.addEventListener('mousemove', onMouseMove)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      parent?.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
    />
  )
}
