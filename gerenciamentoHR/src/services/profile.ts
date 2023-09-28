import { doc, collection, updateDoc, getDoc, addDoc, getDocs, deleteDoc } from "firebase/firestore";
import { db, storage } from "./../config/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { User } from "../pages/Users/types/User";


export const uploadProfilePicture = async (file: File, userId: string): Promise<string | null> => {
  try {
    const storageRef = ref(storage, `profilePictures/${userId}/${file.name}`);

    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  } catch (error) {
    console.error('Erro ao fazer upload da foto de perfil:', error);
    return null;
  }
};

export async function getProfile(id: string) {
  const profileUserRef = doc(db, "profile", id);
  const docSnap = await getDoc(profileUserRef);
  
  const data = docSnap.data();
  console.log("Dados do perfil:", data); 
  
  return data;
}




export async function getAllProfiles(): Promise<User[]> {
  const profileCollectionRef = collection(db, "profile");
  const querySnapshot = await getDocs(profileCollectionRef);
  
  const profiles: User[] = [];

  querySnapshot.forEach((doc) => {
    const profileData = doc.data() as User;
    profileData.id = doc.id; 
    profiles.push(profileData);
  });

  return profiles;
}



// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function adicionarUsuarioAoFirestore(profile: any) {
  try {
    const docRef = await addDoc(collection(db, "profile"), profile);
    console.log("Documento adicionado com sucesso. ID do documento:", docRef.id);
    return docRef.id; 
  } catch (e) {
    console.error("Erro ao adicionar o documento: ", e);
    return null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function atualizarUsuarioNoFirestore(profile: any, id: string) {

  try {
    const profileUserRef = doc(db, "profile", id);
    const res = await updateDoc(profileUserRef, profile);
    console.log(res);
  } catch (e) {
    console.error("Erro ao atualizar o documento: ", e);
  }
}

export async function deleteProfile(id: string): Promise<void> {
  try {
    console.log("Tentando excluir o perfil com ID:", id);
    const profileUserRef = doc(db, "profile", id);
    await deleteDoc(profileUserRef);
    console.log("Perfil excluído com sucesso.");
  } catch (error) {
    console.error("Erro ao excluir o perfil:", error);
    throw error;
  }
}

