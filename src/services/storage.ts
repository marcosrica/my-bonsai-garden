import { Filesystem, Directory } from '@capacitor/filesystem';

export async function savePhoto(base64: string, fileName: string): Promise<string> {
  // Ensure fileName is unique (you can generate with Date.now())
  const result = await Filesystem.writeFile({
    path: `photos/${fileName}.jpg`,
    data: base64,                       // directly the base64 string
    directory: Directory.Data,
    recursive: true
  });
  return result.uri; // permanent file URI, store this in DB
}

export async function getPhotoUrl(fileName: string): Promise<string> {
  const result = await Filesystem.getUri({
    path: `photos/${fileName}`,
    directory: Directory.Data,
  });
  return result.uri;
}