"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps {
  className?: string
  value?: number[]
  defaultValue?: number[]
  min?: number
  max?: number
  step?: number
  onValueChange?: (value: number[]) => void
  disabled?: boolean
}

function Slider({
  className,
  value,
  defaultValue,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  disabled = false,
}: SliderProps) {
  const currentValue = value?.[0] ?? defaultValue?.[0] ?? min
  const percentage = ((currentValue - min) / (max - min)) * 100

  return (
    <div
      data-slot="slider"
      className={cn("relative flex w-full touch-none items-center select-none", className)}
    >
      <div className="relative h-5 w-full flex items-center">
        {/* Track */}
        <div
          data-slot="slider-track"
          className="relative h-1 w-full overflow-hidden rounded-full bg-muted"
        >
          {/* Filled range */}
          <div
            data-slot="slider-range"
            className="absolute h-full bg-primary"
            style={{ width: `${percentage}%` }}
          />
        </div>
        {/* Thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentValue}
          disabled={disabled}
          onChange={(e) => {
            onValueChange?.([Number(e.target.value)])
          }}
          className={cn(
            "absolute inset-0 w-full cursor-pointer opacity-0",
            disabled && "pointer-events-none"
          )}
          aria-label="Slider"
        />
        {/* Visual thumb */}
        <div
          data-slot="slider-thumb"
          className="pointer-events-none absolute block size-3 shrink-0 rounded-full border border-ring bg-white ring-ring/50 transition-[left,box-shadow]"
          style={{ left: `calc(${percentage}% - 6px)` }}
        />
      </div>
    </div>
  )
}

export { Slider }
export type { SliderProps }
