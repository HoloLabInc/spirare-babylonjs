import { writeInt64 } from '../utilities/memoryHelper'
import { ErrorNo, ERROR_NO } from './wasiTypes'

const CLOCK_ID = {
  Realtime: 0,
  Monotonic: 1,
  ProcessCputimeId: 2,
  ThreadCputimeId: 3,
} as const

type ClockId = typeof CLOCK_ID[keyof typeof CLOCK_ID]

const toClockId = (value: number): ClockId | undefined => {
  switch (value) {
    case CLOCK_ID.Realtime:
    case CLOCK_ID.Monotonic:
    case CLOCK_ID.ProcessCputimeId:
    case CLOCK_ID.ThreadCputimeId:
      return value
    default:
      return undefined
  }
}

export const clock_time_get = (
  memory: ArrayBuffer,
  id: number,
  precision: number,
  timestampPtr: number
): ErrorNo => {
  const clockId = toClockId(id)
  if (clockId === undefined) {
    return ERROR_NO.Inval
  }

  let timestamp: bigint
  switch (clockId) {
    case CLOCK_ID.Realtime:
      const now = Date.now()
      // convert to nanoseconds
      timestamp = BigInt(now) * BigInt(1000 * 1000)
      break

    case CLOCK_ID.Monotonic:
      timestamp = BigInt(Math.floor(performance.now() * 1000 * 1000))
      break

    case CLOCK_ID.ProcessCputimeId:
      console.warn('clock_time_get with process_cputime_id is not implemented')
      return ERROR_NO.Inval

    case CLOCK_ID.ThreadCputimeId:
      console.warn('clock_time_get with thread_cputime_id is not implemented')
      return ERROR_NO.Inval

    default:
      return ERROR_NO.Inval
  }

  if (writeInt64(memory, timestampPtr, timestamp)) {
    return ERROR_NO.Success
  }
  return ERROR_NO.Inval
}

export const clock_res_get = (
  memory: ArrayBuffer,
  id: number,
  resultPtr: number
): ErrorNo => {
  const clockId = toClockId(id)
  switch (clockId) {
    case CLOCK_ID.Realtime: {
      // Exact resolution depends on the browser and cannot be obtained.
      // 1 ms
      const resolution = BigInt(1 * 1000 * 1000)
      if (writeInt64(memory, resultPtr, resolution)) {
        return ERROR_NO.Success
      } else {
        return ERROR_NO.Inval
      }
    }

    case CLOCK_ID.Monotonic: {
      // Exact resolution depends on the browser and cannot be obtained.
      // 1 ms
      const resolution = BigInt(1 * 1000 * 1000)
      if (writeInt64(memory, resultPtr, resolution)) {
        return ERROR_NO.Success
      } else {
        return ERROR_NO.Inval
      }
    }

    case CLOCK_ID.ProcessCputimeId:
      console.warn('clock_res_get with process_cputime_id is not implemented')
      return ERROR_NO.Inval

    case CLOCK_ID.ThreadCputimeId:
      console.warn('clock_res_get with thread_cputime_id is not implemented')
      return ERROR_NO.Inval

    default:
      return ERROR_NO.Inval
  }
}
