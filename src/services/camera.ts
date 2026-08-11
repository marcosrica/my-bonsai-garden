import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";

export async function takePhoto(): Promise<string | undefined> {
  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: false,
    resultType: CameraResultType.Uri,
    source: CameraSource.Prompt, //Lets the user choose either the camera or the gallery
  });

  return image.webPath; //Temporary preview url
}