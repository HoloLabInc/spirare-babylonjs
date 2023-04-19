import { isCopyFileError } from '../src/spirare-server'

describe('isCopyFileError', () => {
  test('undefined does not have code', () => {
    const result = isCopyFileError(undefined)
    expect(result).toBe(false)
  })

  test('empty object does not have code', () => {
    const result = isCopyFileError({})
    expect(result).toBe(false)
  })

  test('object which has code is correct error', () => {
    const result = isCopyFileError({ code: 'EEXIST' })
    expect(result).toBe(true)
  })
})
