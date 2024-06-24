import { Client, Account, Databases, Storage, Avatars } from "appwrite";

export const appwriteConfig = {
    url: "https://cloud.appwrite.io/v1",
    projectId: "66342cb0002e9379be7f",
    databaseId: "6638029b00394a4b51b7",
    storageId: "66380242003bdf77c891",
    userCollectionId: "6638032b00138fb47f33",
    postCollectionId: "663802fd0038cf88ee68",
    savesCollectionID: "6638036900206405c071",
    commentCollectionId: "666764680002664fb199",
    snippetCollectionId: "6677bf9500344948a6a9",
    notesCollectionId: "6677bfd6000f20f3115c",
}

export const client = new Client();

client.setProject(appwriteConfig.projectId);
client.setEndpoint(appwriteConfig.url);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);