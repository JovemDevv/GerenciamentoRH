import { doc, collection, updateDoc, getDoc, addDoc, getDocs, deleteDoc } from "firebase/firestore";
import { db, storage } from "./../config/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

// Função para fazer o upload da foto de perfil para o Firebase Storage e retornar a URL
export const uploadProfilePicture = async (file: File, userId: string): Promise<string | null> => {
  try {
    const storageRef = ref(storage, `profilePictures/${userId}/${file.name}`); // Especifique um caminho adequado

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
  console.log("Dados do perfil:", data); // Adicione esta linha para verificar os dados
  
  return data;
}

// Defina uma interface para descrever a estrutura dos dados do perfil
interface ProfileData {
  id: string;
  // Defina os campos do perfil aqui com os tipos corretos
  name: string;
  age: number;
  // Adicione outros campos conforme necessário
}

export async function getAllProfiles(): Promise<ProfileData[]> {
  const profileCollectionRef = collection(db, "profile");
  const querySnapshot = await getDocs(profileCollectionRef);
  
  const profiles: ProfileData[] = [];

  querySnapshot.forEach((doc) => {
    // Use o ID real do Firestore como ID do perfil
    const profileData = doc.data() as ProfileData;
    profileData.id = doc.id; // Defina o ID do perfil como o ID real do Firestore
    profiles.push(profileData);
  });

  return profiles;
}



// Adicionando um novo usuário ao Firestore
export async function adicionarUsuarioAoFirestore(profile: any) {
  try {
    const docRef = await addDoc(collection(db, "profile"), profile);
    console.log("Documento adicionado com sucesso. ID do documento:", docRef.id);
    return docRef.id; // Retorne o ID do novo documento
  } catch (e) {
    console.error("Erro ao adicionar o documento: ", e);
    return null;
  }
}

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

