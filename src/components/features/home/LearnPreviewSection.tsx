"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TheoryBookIcon, ArrowRightIcon } from "@/components/ui/Icons";
import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/Card";
import { Spotlight } from "@/components/ui/spotlight";

export function LearnPreviewSection() {
  return (
    <section className="relative py-24 sm:py-32 border-t border-white/5 bg-[#07080e]/40 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Card
          padding="none"
          className="w-full min-h-[500px] lg:h-[550px] bg-black/[0.96] border border-white/10 rounded-3xl relative overflow-hidden shadow-2xl"
        >
          <Spotlight
            className="-top-40 left-0 md:left-60 md:-top-20"
            fill="white"
          />

          <div className="flex flex-col lg:flex-row h-full">
            <div className="flex-1 p-8 sm:p-12 lg:p-14 relative z-10 flex flex-col justify-center items-start text-left">
              <Badge variant="violet" size="md" className="mb-4">
                <TheoryBookIcon size={13} className="text-accent-violet" />
                <span>Theory Learning Hub</span>
              </Badge>

              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.15]">
                Understand the language{" "}
                <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                  of music.
                </span>
              </h2>

              <p className="mt-4 text-base sm:text-lg text-neutral-300 max-w-lg leading-relaxed font-sans">
                Learn music theory through clear explanations, visual demonstrations, guided
                lessons, and examples connected to the music you already love.
              </p>

              <div className="mt-8 flex items-center gap-4">
                <Button
                  href="/learn"
                  variant="primary"
                  size="md"
                  icon={<ArrowRightIcon size={16} />}
                  iconPosition="right"
                >
                  Explore the learning hub
                </Button>
              </div>
            </div>

            <div className="flex-1 relative w-full h-[400px] lg:h-auto min-h-[400px]">
              <SplineScene
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full"
              />
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
