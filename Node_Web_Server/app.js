const mailer = require('./mailer.js');
const express = require('express');
var httpService = require('./httpService');
const cors = require('cors');
const firebaseService = require('./firebaseConfig');
const bodyParser = require('body-parser');
const { json } = require('stream/consumers');
const axios = require('axios');
const { topic } = require('firebase-functions/v1/pubsub');

require('dotenv').config()
const app = express();
app.use(cors())
// app.options('*', cors()) 
const PORT = 5050;
app.use(express.json());
app.use(bodyParser.json());

algoServerIP = '';
algoPort = '';
if(process.env.STATUS == "production"){
    algoPort = process.env.ALGO_PROD_PORT;
    algoServerIP = process.env.ALGO_PROD_URL;
}
else{
    algoPort = process.env.ALGO_DEV_PORT;
    algoServerIP = process.env.ALGO_DEV_URL;
}


app.listen(PORT, (error) =>{
    if(!error){
        console.log(`Server is Successfully Running in ${process.env.STATUS} mode, and App is listening on port ` + PORT);
    }
    else 
        console.log("Error occurred, server can't start", error);
    }
);

app.post("/user", (req, res) => {
    //req  parameters:  userName and password.isAdmin is false always if the user name is already exist return res = "this user name is not available"
    // createUser(req.query.userName, req.query.password, res);
});

//request from front to algo
app.post("/uploadVideo", async(req, res) => {
    if (Object.keys(req.body).length === 0) {
        res.status(400).json({ error: 'Request body cannot be empty' });
      } else {
        res.status(200).send();
        const inner_topics = await firebaseService.getAllInnerTopics(firebaseService.innerTopicsCollection);
        req.body.inner_topics = inner_topics.inner_topics
        sendToAlgoServer(algoServerIP + ":" + algoPort , JSON.stringify(req.body));
        console.log("uploadVideo -> request sent to algo server")
      }
});

//algo response
app.post("/uploadVideoAlgo",async (req, res) => {
    if (Object.keys(req.body).length === 0) {
        res.status(400).json({ error: 'Request body cannot be empty' });
      } else {
        const data = JSON.stringify(req.body); // Get JSON data from request body
        const obj = JSON.parse(data);
        console.log(obj)
        topics = obj.topics
        obj.lowerName = obj.name.toLowerCase()
        if(topics != undefined){
            // new subject
            let documentRef = await firebaseService.topicsCollection.doc('our_topics_list')
            documentRef.update({
                'topics': topics
              })
              .then(function() {
                console.log("Document successfully updated!");
              })
              .catch(function(error) {
                console.error("Error updating document: ", error);
              });

              rewrite_inner_subjects(obj.inner_topics)
        }
        delete obj.topics
        delete obj.inner_topics
        
        firebaseService.createVideo(firebaseService.videoCollection, obj);
        res.status(200).send();
        mailer.sendMailToClient("obn2468@gmail.com","or", obj.name)
        console.log("sent mail from /uploadVideoAlgo post")
        console.log("finished upload")
      }
});

app.get("/video",(req,res) => {
    res.send(getAllVideos());
});

app.get("/getAllTopics",async (req,res) => {
    try {
        const documentData = await firebaseService.getAllTopics(firebaseService.topicsCollection);
        res.status(200).json(documentData);
      } catch (error) {
        res.status(500).json({ error: error.message });
      };
});

app.get("/videosByTag",(req,res) => {
    let tag = req.query.tag;
    firebaseService.searchVideosByTags(firebaseService.videoCollection,tag, (error, searchResults) => {
        if (error) {
          res.status(500).send('Internal Server Error'); // Handle error response
        } else {
          res.json(searchResults); // Return search results as JSON response
        }
      });
    });

app.get("/videoById",async (req,res) => {
    const id = req.query.id;
    try {
        const documentData = await firebaseService.searchVideosById(firebaseService.videoCollection, id);
        res.status(200).json(documentData);
      } catch (error) {
        res.status(500).json({ error: error.message });
      };
});

  
app.get("/searchVideoByName",(req,res) => {
    // console.log(req);
    const name = req.query.name;
    firebaseService.searchVideo(firebaseService.videoCollection,name).then( (r) =>
    {
        const json = JSON.stringify(r)
        console.log(json);
        if(json == "{}")
            res.send(200);
        else
            res.send(json);    
    });
});

async function sendToAlgoServer(url, data) {
    axios.post(url, data)
    .then(response => {
        console.log(response.data);
    })
    .catch(error => {
        console.error(error);
    });
  }

async function rewrite_inner_subjects(inner_topics){
  let documentRef = await firebaseService.innerTopicsCollection.doc('our_inner_topics')
  documentRef.update({
      'inner_topics': inner_topics
    })
    .then(function() {
      console.log("Document successfully updated!");
    })
    .catch(function(error) {
      console.error("Error updating document: ", error);
    });
}

