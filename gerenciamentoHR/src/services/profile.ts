import {
  doc,
  collection,
  updateDoc,
  getDoc,
  addDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { db, storage } from "./../config/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { User } from "../pages/Users/types/User";

export const uploadProfilePicture = async (
  file: File,
  userId: string,
): Promise<string | null> => {
  try {
    const storageRef = ref(storage, `profilePictures/${userId}/${file.name}`);

    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  } catch (error) {
    console.error("Erro ao fazer upload da foto de perfil:", error);
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
    console.log(
      "Documento adicionado com sucesso. ID do documento:",
      docRef.id,
    );
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
    const profileData = await getDoc(profileUserRef);

    if (!profileData.exists()) {
      console.error("Documento não encontrado.");
      return;
    }

    const previousData = profileData.data(); // Dados anteriores do perfil
    const updateData: Update = {
      userId: id,
      timestamp: new Date().toISOString(),
      field: "", // Defina o campo que está sendo atualizado
      oldValue: "", // Defina o valor antigo do campo
      newValue: "", // Defina o novo valor do campo
    };

    // Atualize os dados do perfil
    await updateDoc(profileUserRef, profile);

    // Verifique as alterações e adicione ao histórico de atualizações
    Object.keys(profile).forEach((key) => {
      if (previousData && previousData[key] !== profile[key]) {
        updateData.field = key;
        updateData.oldValue = previousData[key];
        updateData.newValue = profile[key];
        // Adicione a atualização à coleção userUpdates
        addDoc(collection(db, "userUpdates"), updateData);
      }
    });

    console.log("Documento atualizado com sucesso.");
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

// Função para obter o histórico de atualizações de um usuário
interface Update {
  userId: string;
  timestamp: string;
  field: string;
  oldValue: string;
  newValue: string;
}

export async function obterHistoricoAtualizacoesUsuario(userId: string) {
  try {
    const userUpdatesRef = collection(db, "userUpdates");
    const querySnapshot = await getDocs(userUpdatesRef);
    const updates: Update[] = [];

    querySnapshot.forEach((doc) => {
      const updateData = doc.data() as Update;
      if (updateData.userId === userId) {
        updates.push(updateData);
      }
    });

    return updates;
  } catch (error) {
    console.error("Erro ao obter o histórico de atualizações:", error);
    throw error;
  }
}
