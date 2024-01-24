export class Helpers {
    static getFileExtension(fileName: string) {
      const fileNameSplits = fileName.split('.')
  
      return fileNameSplits[fileNameSplits.length - 1]
    }
  }