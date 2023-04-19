export const getMemory = (
  instance: WebAssembly.Instance | undefined
): ArrayBuffer | undefined => {
  if (instance === undefined) {
    return undefined
  }

  const memory = instance.exports.memory
  if (memory === undefined) {
    return undefined
  }

  if ('buffer' in memory) {
    return memory.buffer
  }
}

export const getExportedFunction = (
  instance: WebAssembly.Instance,
  functionName: string
): Function | undefined => {
  const func = instance.exports[functionName]
  if (func !== undefined && 'apply' in func) {
    return func
  }
  return undefined
}
