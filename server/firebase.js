import admin from "firebase-admin";
import fs from "fs";

const serviceAccount = JSON.parse(
  fs.readFileSync("./serviceAccountKey.json", "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "eighbit-blogv2.appspot.com"
});

const bucket = admin.storage().bucket();

export { bucket };
