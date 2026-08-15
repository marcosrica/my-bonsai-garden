import JSZip, { files } from "jszip";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import { addFullTreeData, getConnection } from "@/services/database";
import { ref } from "vue";
import { FilePicker } from "@capawesome/capacitor-file-picker";

interface unzippedFile {
  name: string,
  url: string
}

export async function createBackup(): Promise<string | null> {
  const zip = new JSZip();

  //First export the database tables as JSON objects
  const db = await getConnection();
  const exportResult = await db.exportToJson('full');
  const dbJson = JSON.stringify(exportResult, null, 2);
  zip.file('database.json', dbJson);

  //Adding all the photos from the private app directory
  try {
    const photoDirectory = await Filesystem.readdir({ path: 'photos', directory: Directory.Data });

    for (const file of photoDirectory.files) {
      const photoData = await Filesystem.readFile({ path: `photos/${file.name}`, directory: Directory.Data });
      zip.file(`photos/${file.name}`, photoData.data as string, { base64: true });
    }
  }
  catch (error) {
    //Photos folder doesn't exist
    console.warn('No photos directory found. Skipping images');
  }

  //Generate the zip as base64
  const zipBase64 = await zip.generateAsync({ type: 'base64' });

  //Save the file to a user-accessible location
  const fileName = `bonsai-backup-${new Date().toISOString().slice(0, 10)}.zip`;
  try {
    //Sharing the zip file via the share sheet
    //Loading the zip on the cache
    const cacheUri = await Filesystem.writeFile({
      path: fileName,
      data: zipBase64,
      directory: Directory.Cache,
      recursive: true
    });

    //Opening the share sheet
    await Share.share({
      title: 'Bonsai Backup',
      text: 'Copia de seguridad de los bonsais',
      url: cacheUri.uri,
      dialogTitle: 'Compartir la copia de seguridad',
    });

    //Now save the data in the downloads folder
    await Filesystem.writeFile({
      path: `Download/${fileName}`,
      data: zipBase64,
      directory: Directory.External,
      recursive: true,
    });

    return fileName;
  }
  catch (error) {
    alert("Ha ocurrido un error al intentar guardar la copia de seguridad");
    return "";
  }
} 

export async function restoreBackup() {
  const unzippedFiles = ref<unzippedFile[]>([]);

  try {
    //Let the user choose the zip file
    const result = await FilePicker.pickFiles({
      types: [
        'application/zip',
        'application/x-zip-compressed',
        'application/octet-stream',
      ],
      readData: true,
    });

    const pickedFile = result.files[0];
    //Checking if file was actually picked
    if (!pickedFile || !pickedFile.data) {
      console.warn("No file data recieved");
      return;
    }

    //Unzip the file
    const zip = await JSZip.loadAsync(pickedFile.data, { base64: true });

    const entries = Object.values(zip.files);
    let dbData: string = "";
    const photos: unzippedFile[] = [];
    console.log("ENTRIES");
    console.log(entries);
    
    for (const entry of entries) {
      if (entry.dir) {
        //Ignoring directories (folders)
        continue;
      }

      if (entry.name.includes(".json")) {
        console.log("FOUND DATABASE JSON");
        dbData = await entry.async('text');
      }
      else {
        //Checking if it's an image, or some random noise 
        const isImage = /\.(jpe?g|png|gif|webp|bmp)$/i.test(entry.name);
        
        if (isImage) {
          //It's an image
          //Getting its binary data
          const arrayBuffer = await entry.async('arraybuffer');
          const base64Data = encodeInBase64(arrayBuffer);

          const nameParts: string[] = entry.name.split("/");
          const fileName: string = nameParts[nameParts.length - 1] || "no_name.jpg";

          console.log("saving picture in ", fileName);
          
          //Saving the image to the correct path
          const result = await Filesystem.writeFile({
            path: `photos/${fileName}`,
            data: base64Data,
            directory: Directory.Data,
            recursive: true
          });

          photos.push({ name: fileName, url: result.uri });
        }
      }
    }

    unzippedFiles.value = photos;

    if (dbData != "") {
      const jsonData = JSON.parse(dbData);
      console.log("DATABASE INFO : ", jsonData);
      await restoreDb(jsonData, photos);
    }
  }
  catch (error) {
    console.error('Error in the process');
    alert('Ha ocurrido un error en el proceso de restauración de los datos');
  }
}

function encodeInBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte) });
  return btoa(binary);  
}

async function restoreDb(data: any, photos:unzippedFile[]) {
  console.log("DATABSE TABLES: ", data.export.tables);
  const tables = Object.entries(data.export.tables);

  for (const [tableName, tableData] of Object.entries(data.export.tables)) {
    console.log("Table iterated:", tableName, tableData);
    const newData = (tableData as any);
    
    switch (newData.name) {
      case "trees":
        console.log("Working on trees database");
        await restoreTreesDb(newData.schema, newData.values, photos);
    }
  }
}

async function restoreTreesDb(schema: any, values: any, photos:unzippedFile[]) {
  console.log("Working on restoring the trees database with table structure ", schema);
  
  for (const [rowPos, data] of Object.entries(values)) {
    console.log("Row iterated:", data);
    const rowData = (data as any);

    const name = rowData[2];
    const description = rowData[3];
    const species = rowData[5];
    const yearPlanted = rowData[6];
    const lastTransplanted = rowData[7];
    const lastAbonated = rowData[8];
    const createdAt = rowData[9];
    const dead = rowData[1];

    //Treating the image
    const startingImage:string = rowData[4];
    const startingImageParts:string[] = startingImage.split("/");
    const end:string = startingImageParts[startingImageParts.length - 1] || "undefined";
    
    const image = getUrl(end, photos);
    
    const response = await addFullTreeData(name, description, image, species, yearPlanted, lastTransplanted, lastAbonated, createdAt, dead);

    if (!response) {
      alert("Ha ocurrido un error mientras se recuperaba la base de datos");
      return;
    }
  }
}

function getUrl(name: string, photos: unzippedFile[]): string {
  for (let i = 0; i < photos.length; i++) {
    let picture: unzippedFile = photos[i] || {name: "missing", url: ""};

    if (picture.name.includes(name)) {
      return picture.url;
    }
  }

  return "";
}