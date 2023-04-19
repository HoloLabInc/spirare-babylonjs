import { SpirareEventType } from '../../types'

export const ERROR_NO = {
  Success: 0,
  UnknownError: 1,
  InvalidArgument: 2,
  NotImplemented: 3,
  ElementNotFound: 4,
  InsufficientBufferSize: 5,
  UnsupportedOperation: 6,
} as const

export type ErrorNo = typeof ERROR_NO[keyof typeof ERROR_NO]

export const numToEventType = (value: number): SpirareEventType | undefined => {
  switch (value) {
    case 0:
      return 'start'
    case 1:
      return 'update'
    case 2:
      return 'select'
    default:
      return undefined
  }
}

export const ANIMATION_STATE = {
  stop: 0,
  play: 1,
}

export type AnimationState = keyof typeof ANIMATION_STATE

export const numToAnimationState = (
  value: number
): AnimationState | undefined => {
  switch (value) {
    case ANIMATION_STATE.stop:
      return 'stop'
    case ANIMATION_STATE.play:
      return 'play'
    default:
      return undefined
  }
}

export const ANIMATION_WRAP = {
  once: 0,
  loop: 1,
}

export type AnimationWrap = keyof typeof ANIMATION_WRAP

export const numToAnimationWrap = (
  value: number
): AnimationWrap | undefined => {
  switch (value) {
    case ANIMATION_WRAP.once:
      return 'once'
    case ANIMATION_WRAP.loop:
      return 'loop'
    default:
      return undefined
  }
}
