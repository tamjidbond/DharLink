const admin = require("firebase-admin");
const serviceAccount = require("./dhar-now-firebase-adminsdk-fbsvc-191ce7d985.json"); // <-- download from Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
