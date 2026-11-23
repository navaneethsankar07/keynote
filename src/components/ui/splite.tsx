'use client'

import React, { Component, Suspense, lazy, useState, type ErrorInfo, type ReactNode } from 'react'
import type { Application } from '@splinetool/runtime'
import Image from 'next/image'
import { RefreshCw } from 'lucide-react'

const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineErrorBoundaryProps {
  fallback?: ReactNode
  children: ReactNode
  onReset?: () => void
}

interface SplineErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class SplineErrorBoundary extends Component<SplineErrorBoundaryProps, SplineErrorBoundaryState> {
  constructor(props: SplineErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): SplineErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('[SplineScene] Scene failed to load:', error?.message || error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
    this.props.onReset?.()
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-violet-600/15 blur-3xl" />
          </div>

          <div className="relative z-10 flex flex-col items-center gap-3 max-w-sm">
            <div className="relative w-44 h-44 sm:w-56 sm:h-56">
              <Image
                src="/images/3d/robot-character.png"
                alt="3D Music Character"
                fill
                sizes="(max-width: 640px) 176px, 224px"
                className="object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)] filter brightness-95"
                priority
              />
            </div>
            
            <button
              type="button"
              onClick={this.handleRetry}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono text-neutral-300 bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 transition-colors shadow-lg cursor-pointer"
            >
              <RefreshCw className="size-3" />
              <span>Retry interactive 3D</span>
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export interface SplineSceneProps {
  scene: string
  className?: string
  fallback?: ReactNode
  onLoad?: (spline: Application) => void
}

export function SplineScene({ scene, className, fallback, onLoad }: SplineSceneProps) {
  const [retryKey, setRetryKey] = useState(0)

  return (
    <SplineErrorBoundary
      key={retryKey}
      fallback={fallback}
      onReset={() => setRetryKey((k) => k + 1)}
    >
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
          onLoad={onLoad}
        />
      </Suspense>
    </SplineErrorBoundary>
  )
}
