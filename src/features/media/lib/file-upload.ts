export const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        reject(new Error('Failed to read file'))
        return
      }
      resolve(reader.result)
    }
    reader.readAsDataURL(file)
  })
