import { Filesystem, Directory } from "@capacitor/filesystem";

export async function savePhoto(blob: Blob, fileName: string): Promise<string> {
  //Converting the blob to base64
  const base64 = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });

  const result = await Filesystem.writeFile({
    path: `photos/${fileName}`,
    data: base64,
    directory: Directory.Data,
  })

  return result.uri;
}

export async function getPhotoUrl(fileName: string): Promise<string> {
  return (await Filesystem.getUri({
    path: `photos/${fileName}`,
    directory: Directory.Data,
  })).uri;
}