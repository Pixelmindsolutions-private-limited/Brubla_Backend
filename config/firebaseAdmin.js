import admin from "firebase-admin";
import serviceAccount from "../config/firebase-service-account.json" with { type: "json" };

if (!serviceAccount) {
  throw new Error("Firebase service account credentials not found.");
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;