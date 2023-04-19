export function* filenameGenerator(originalName: string) {
  yield originalName

  const dotIndex = originalName.indexOf('.')

  let filenameWithoutExtension: string
  let extension: string

  if (dotIndex == -1) {
    filenameWithoutExtension = originalName
    extension = ''
  } else {
    filenameWithoutExtension = originalName.substring(0, dotIndex)
    extension = originalName.substring(dotIndex)
  }

  for (let i = 1; ; i++) {
    yield `${filenameWithoutExtension}_${i}${extension}`
  }
}
