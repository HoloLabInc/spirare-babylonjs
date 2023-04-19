export const ERROR_NO = {
  Success: 0,
  Toobig: 1,
  Access: 2,
  Addrinuse: 3,
  Addrnotavail: 4,
  Afnosupport: 5,
  Badf: 8,
  Inval: 28,
} as const

export type ErrorNo = typeof ERROR_NO[keyof typeof ERROR_NO]
