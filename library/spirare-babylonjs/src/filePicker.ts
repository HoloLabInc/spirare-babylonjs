import { detect } from 'detect-browser'

export type FilePickerOptions = {
  accept: string
  multiple?: boolean
}

const browser = detect()

/**
 * Opens the file picker dialog and returns the selected files.
 * @param options - Options for the file picker, including accepted file types and whether multiple files can be selected.
 * @returns Promise containing the selected files.
 */
export const openFilePicker = async (
  options: FilePickerOptions
): Promise<FileList | null> => {
  const input = document.createElement('input')
  input.style.display = 'none'
  input.type = 'file'

  if (browser) {
    // Safari does not work well with accept extension specification
    if (browser.name !== 'safari') {
      input.accept = options.accept
    }
  }
  input.multiple = options.multiple ?? false

  document.body.appendChild(input)

  return new Promise((resolve, reject) => {
    input.onchange = (e) => {
      document.body.removeChild(input)
      const target = e.target as HTMLInputElement
      resolve(target.files)
    }

    input.click()
  })
}
