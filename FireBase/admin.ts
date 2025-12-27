// @/FireBase/admin.ts
import { initializeApp, getApps, cert, getApp, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

function getServiceAccount() {
  const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n').trim();

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      `Missing Firebase env vars: projectId=${!!projectId}, clientEmail=${!!clientEmail}, privateKey=${!!privateKey}`
    );
  }

  return {
    project_id: projectId,
    client_email: clientEmail,
    private_key: privateKey,
  };
}

// Initialize only once
let adminApp: App;
if (!getApps().length) {
  try {
    adminApp = initializeApp({
      credential: cert(getServiceAccount()),
    });
  } catch (error: any) {
    console.error('Firebase Admin init failed:', error.message);
    throw error;
  }
} else {
  adminApp = getApp();
}

// Export services
export const auth = getAuth(adminApp);
export const db = getFirestore(adminApp);
export default adminApp; // Named default export
