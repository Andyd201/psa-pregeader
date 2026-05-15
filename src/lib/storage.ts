// Storage interface — replace implementation with Cloudflare R2 when ready.
export interface StorageClient {
  upload(key: string, buffer: Buffer, contentType: string): Promise<string>;
  getUrl(key: string): string;
}

// Local stub — not persisted, returns a placeholder path.
export const localStorageStub: StorageClient = {
  async upload(key) {
    return `/uploads/${key}`;
  },
  getUrl(key) {
    return `/uploads/${key}`;
  },
};
