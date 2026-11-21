'use client'

import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import type { Application } from '@splinetool/runtime'

const Spline = lazy(() => import('@splinetool/react-spline'))

interface ExtendedApplication extends Application {
  _requestRenderAutoMode?: () => void
}

interface SplineSceneProps {
  scene: string
  className?: string
  onLoad?: (spline: Application) => void
}

export function SplineScene({ scene, className, onLoad }: SplineSceneProps) {
  const [splineApp, setSplineApp] = useState<ExtendedApplication | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleLoad = (app: Application) => {
    const extendedApp = app as ExtendedApplication
    setSplineApp(extendedApp)
    if (typeof extendedApp.setGlobalEvents === 'function') {
      extendedApp.setGlobalEvents(true)
    }
    onLoad?.(extendedApp)
  }

  useEffect(() => {
    if (!splineApp) return

    const canvas = splineApp.canvas || containerRef.current?.querySelector('canvas')
    if (!canvas) return

    let animationFrameId: number | null = null
    let framesToRender = 0

    const step = () => {
      if (framesToRender > 0) {
        framesToRender--
        splineApp.requestRender?.()
        if (typeof splineApp._requestRenderAutoMode === 'function') {
          splineApp._requestRenderAutoMode()
        }
        animationFrameId = requestAnimationFrame(step)
      } else {
        animationFrameId = null
      }
    }

    const handleGlobalPointerMove = (e: PointerEvent) => {
      if (e.target !== canvas) {
        const syntheticEvent = new PointerEvent('pointermove', {
          clientX: e.clientX,
          clientY: e.clientY,
          screenX: e.screenX,
          screenY: e.screenY,
          pointerId: e.pointerId || 1,
          pointerType: e.pointerType || 'mouse',
          isPrimary: true,
          bubbles: true,
          cancelable: true,
          buttons: e.buttons,
        })
        Object.assign(syntheticEvent, {
          pageX: e.pageX,
          pageY: e.pageY,
        })
        canvas.dispatchEvent(syntheticEvent)
      }

      framesToRender = 35
      if (animationFrameId === null) {
        animationFrameId = requestAnimationFrame(step)
      }
    }

    window.addEventListener('pointermove', handleGlobalPointerMove, { passive: true })

    return () => {
      window.removeEventListener('pointermove', handleGlobalPointerMove)
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [splineApp])

  return (
    <div ref={containerRef} className="w-full h-full">
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <span className="w-8 h-8 rounded-full border-2 border-white/20 border-t-accent-violet animate-spin" />
              <span className="text-xs font-mono text-white/40">Loading 3D scene...</span>
            </div>
          </div>
        }
      >
        <Spline
          scene={scene}
          className={className}
          onLoad={handleLoad}
        />
      </Suspense>
    </div>
  )
}
