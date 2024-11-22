
import { ref , uploadBytes , getDownloadURL} from "firebase/storage";
import { Storage} from "./firebase.tsx";

export const uploadImage = async (e: any, fileName: string): Promise<string | null> => {
    try {
        const img: any = e;
        const imageRef = ref(Storage, `images/profile/${fileName}_${new Date().getUTCDate()}`);
        const uploadResult = await uploadBytes(imageRef, img);
        console.log("Upload successful:", uploadResult);
        const downloadURL = await getDownloadURL(uploadResult.ref);
        return downloadURL;
    } catch (error) {
        console.error("Error uploading image:", error);
        return null;
    }
};

/**
 * @param file 
 * @param fileName 
 * @param folder 
 * @returns 
 */
export const uploadFile = async (
  file: File, 
  fileName: string, 
): Promise<string | null> => {
  try {
    const fileExtension = file.name.split(".").pop();
    if (!fileExtension) throw new Error("Invalid file type");

    const fileRef = ref(Storage, `attachment/${fileName}_${new Date().getTime()}.${fileExtension}`);

    const uploadResult = await uploadBytes(fileRef, file);
    console.log("Upload successful:", uploadResult);

    const downloadURL = await getDownloadURL(uploadResult.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
};