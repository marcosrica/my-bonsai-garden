import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

export interface CapturedImage {
  base64: string;      // raw base64 data (without data: prefix)
  dataUrl: string;     // for preview (data:image/jpeg;base64,...)
}

export async function pickImage(): Promise<CapturedImage | null> {
  try {
    const image = await Camera.getPhoto({
      quality: 85,
      allowEditing: false,
      resultType: CameraResultType.Base64,   // get base64 string
      source: CameraSource.Prompt,           // let user choose camera or gallery
    });

    const base64 = image.base64String;
    if (!base64) return null;

    return {
      base64,
      dataUrl: `data:image/jpeg;base64,${base64}`,
    };
  } catch (error) {
    console.error('Error picking image:', error);
    return null;
  }
}

export async function shootImage(): Promise<CapturedImage | null> {
  try {
    const image = await Camera.getPhoto({
      quality: 85,
      allowEditing: false,
      source: CameraSource.Camera,
      resultType: CameraResultType.Base64,   // get base64 string
    });

    const base64 = image.base64String;
    if (!base64) return null;

    return {
      base64,
      dataUrl: `data:image/jpeg;base64,${base64}`,
    };
  } catch (error) {
    console.error('Error picking image:', error);
    return null;
  }
}

export async function chooseImage(): Promise<CapturedImage | null> {
  try {
    const image = await Camera.getPhoto({
      quality: 85,
      allowEditing: false,
      source: CameraSource.Photos,
      resultType: CameraResultType.Base64,   // get base64 string
    });

    const base64 = image.base64String;
    if (!base64) return null;

    return {
      base64,
      dataUrl: `data:image/jpeg;base64,${base64}`,
    };
  } catch (error) {
    console.error('Error picking image:', error);
    return null;
  }
}