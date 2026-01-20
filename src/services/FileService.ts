export class FileService {
  private static supported: boolean | null = null;

  static isSupported(): boolean {
    if (this.supported === null) {
      this.supported = typeof window !== 'undefined' && 'showDirectoryPicker' in window;
    }
    return this.supported;
  }

  static async saveToDirectory(
    content: string,
    filename: string,
    mimeType: string = 'application/json'
  ): Promise<void> {
    if (!this.isSupported()) {
      throw new Error('File System Access API not supported');
    }

    try {
      const dirHandle = await window.showDirectoryPicker();
      const fileHandle = await dirHandle.getFileHandle(filename, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(content);
      await writable.close();
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        return;
      }
      throw error;
    }
  }

  static download(content: string, filename: string, mimeType: string = 'application/json'): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  static async downloadWithFallback(
    content: string,
    filename: string,
    mimeType: string = 'application/json'
  ): Promise<void> {
    if (this.isSupported()) {
      try {
        await this.saveToDirectory(content, filename, mimeType);
        return;
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          return;
        }
      }
    }
    this.download(content, filename, mimeType);
  }
}
