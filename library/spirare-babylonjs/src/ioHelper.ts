export class IOHelper {
  public static downloadText(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/plain' })
    IOHelper.downloadBlob(blob, filename)
  }

  public static downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    document.body.appendChild(a)
    a.download = filename
    a.href = url
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  public static async readFileTextAsync(file: Blob): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result
        if (typeof result === 'string') {
          resolve(result)
        } else {
          reject()
        }
      }
      reader.readAsText(file)
    })
  }
}
