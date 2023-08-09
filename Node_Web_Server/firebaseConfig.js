var admin = require('firebase-admin');
const {
  getFirestore,
  CollectionReference,
  DocumentReference,
} = require('firebase-admin/firestore');
require('dotenv').config();

const serviceAccount = require('./serviceAccount.json');

const fireBaseApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL,
});
const db = getFirestore(fireBaseApp);
const videoCollection = db.collection('videos');
const bookCollection = db.collection('neuralnetworksanddeeplearning');
const topicsCollection = db.collection('topics');
const innerTopicsCollection = db.collection('inner_topics');

async function getCollectionData(collection) {
  const docsRef = collection;
  const mainDocs = [];

  const docs = await docsRef.get();
  docs.forEach(async (doc) => {
    mainDocs.push({ ...doc.data(), _id: doc.id });
  });

  return mainDocs;
}

async function searchVideosByTags(videoCollection, queryText, callback) {
  videoCollection
    .where('tags', 'array-contains', queryText)
    .get()
    .then((querySnapshot) => {
      const searchResults = querySnapshot.docs.map((doc) => doc.data());
      callback(null, searchResults); // Pass the search results to the callback function
    })
    .catch((error) => {
      console.log('Error getting documents: ', error);
      callback(error, null); // Pass the error to the callback function
    });
}

async function searchVideosById(videoCollection, id) {
  try {
    let documentRef = await videoCollection.doc(id);
    const documentSnapshot = await documentRef.get();

    if (documentSnapshot.exists) {
      const documentData = documentSnapshot.data();
      return documentData;
    } else {
      throw new Error('Document does not exist');
    }
  } catch (error) {
    throw new Error(`Error retrieving document: ${error.message}`);
  }
}

async function searchVideo(videoCollection, queryText) {
  var newRef = videoCollection
    .where('lowerName', '>=', queryText.toLowerCase())
    .where('lowerName', '<=', queryText.toLowerCase() + '\uf8ff');


  // var newSmallerRef = videoCollection.where("name", "<=", videoName);

  

  const mainDocs = [];

  var docs = await newRef.get();

  docs.forEach(async (doc) => {
    mainDocs.push({ ...doc.data(), _id: doc.id });
  });

  // docs = await newSmallerRef.get();
  // docs.forEach(async (doc) => {
  //     mainDocs.push({ ...doc.data(), _id: doc.id });
  //   });

  return mainDocs;
}

// async function createVideo(videoCollection,videoObj){
//   return await videoCollection.doc()
//     .set(videoObj);
// }

async function createVideo(videoCollection, videoObj) {
  const docRef = videoCollection.doc();
  const videoId = docRef.id;

  // Add the ID field to the video object
  const videoWithId = { ...videoObj, id: videoId };

  await docRef.set(videoWithId);
}

async function getAllTopics(topicCollection) {
  try {
    let documentRef = await topicCollection.doc('our_topics_list');
    const documentSnapshot = await documentRef.get();

    if (documentSnapshot.exists) {
      const documentData = documentSnapshot.data();
      return documentData;
    } else {
      throw new Error('Document does not exist');
    }
  } catch (error) {
    throw new Error(`Error retrieving document: ${error.message}`);
  }
}

async function getAllInnerTopics(topicCollection) {
  try {
    let documentRef = await topicCollection.doc('our_inner_topics');
    const documentSnapshot = await documentRef.get();

    if (documentSnapshot.exists) {
      const documentData = documentSnapshot.data();
      return documentData;
    } else {
      throw new Error('Document does not exist');
    }
  } catch (error) {
    throw new Error(`Error retrieving document: ${error.message}`);
  }
}

// module.exports = book;
// module.exports = db;
module.exports.videoCollection = videoCollection;
module.exports.bookCollection = bookCollection;
module.exports.topicsCollection = topicsCollection;
module.exports.innerTopicsCollection = innerTopicsCollection;
module.exports.getCollectionData = getCollectionData;
module.exports.createVideo = createVideo;
module.exports.searchVideo = searchVideo;
module.exports.searchVideosByTags = searchVideosByTags;
module.exports.searchVideosById = searchVideosById;
module.exports.getAllTopics = getAllTopics;
module.exports.getAllInnerTopics = getAllInnerTopics;
