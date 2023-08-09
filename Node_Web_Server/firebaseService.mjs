import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
} from 'firebase/firestore/lite';

const firebaseConfig = {
  apiKey: 'AIzaSyCBfJ5QsytSQqkipNUqk7cbHl5chQ9A-hk',
  authDomain: 'video-indexing-project.firebaseapp.com',
  projectId: 'video-indexing-project',
  storageBucket: 'video-indexing-project.appspot.com',
  messagingSenderId: '135604416968',
  appId: '1:135604416968:web:b03e6d36113324991f10fd',
};

const fireBaseApp = initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.PROJECT_ID,
    privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.CLIENT_EMAIL,
  }),
  databaseURL: process.env.DATABASE_URL,
});
// console.log("here")
const db = getFirestore(fireBaseApp);

async function getAllVideos(db) {
  const videoCollection = collection(db, 'videos');
  const videoSnapshot = await getDocs(videoCollection);
  const videoList = videoSnapshot.docs.map((doc) => doc.data());
  return JSON.stringify(videoList);
}

async function getSingleVideo(db, videoName) {
  const videoCollection = collection(db, 'videos');
  const nameQuery = query(videoCollection, where('name', '>=', videoName));
  const querySnapshot = await getDocs(q);
  const videoList = querySnapshot.docs.map((doc) => doc.data());
  return JSON.stringify(videoList);
}

async function pushVideo(db, videoJsonData) {
  await setDoc(doc(db, 'videos'), videoJsonData);
}
export function test() {
  console.log(app.name);
}
