const express = require('express')
var bodyParser = require('body-parser')
var admin = require("firebase-admin");
var cache = require('memory-cache');
var request = require("request");
const app = express();
const cors = require("cors");
const apikey = "925eba28";
var serviceAccount = require("./tech-challenge-2ccfa-firebase-adminsdk-6scu7-5f55a9c7f4.json"); 

//Initializing firebase database
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tech-challenge-2ccfa-default-rtdb.firebaseio.com"
});

const corsOptions ={
  origin: 'http://tech-challenge-frontend.herokuapp.com', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}

const db = admin.database();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => { console.log(`Server listening on port ${PORT}`); });

//add headers to http response, in all GET/POST methods, it's necessary because we are using the beckend and frontend in a differente domain.
app.all('*', function(req, res, next){
  res.header("Access-Control-Allow-Origin", 'http://tech-challenge-frontend.herokuapp.com');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res) => {
  res.send({"result": "ok"});
});

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies

//add favorite movie from movie list.
app.post('/favorites', function (req, res) {
  var post_body = req.body;
  console.log(post_body);
  let ref = db.ref('favorites');
  ref = ref.child(req.body.user.uid).child(req.body.imdbID);
  ref.set({post_body});
  res.send({"result": "ok"});
  return
})

//remove favorite movie from movie list.
app.post('/removefavorites', function (req, res) {
  var post_body = req.body;
  console.log(post_body);
  let ref = db.ref('favorites');
  console.log("removeFirebase");
  ref = ref.child(req.body.user.uid).child(req.body.imdbID);
  ref.remove().then(() => {
    res.send({"result": "ok"})
  })
  .catch(error => {
    res.send(error);
  });
  return
})

//return favorite movie list.
app.get('/getfavorites', (req, res) => {
  console.log(req.query.id)
  let firebasearray = [];
  admin.database().ref("favorites").once("value", snap => {
    res.send(JSON.stringify(snap.val(), null, 3));
  });    
  return
})

app.get('/results', (req, res) => {
  const movieName = req.query.movie;
  console.log("cache")
  //Try to reach cache memory on result keyword
  if(cache.get(movieName)!==null){
    console.log("getting cache value")
    res.send(cache.get(movieName))
    return 
  }else{
    //Try to reach firebase database on result keyword and save data in cache.
    console.log("firebase")
    admin.database().ref("results").once("value", snap => {
      if(snap.child(movieName).exists()){
        console.log("getting firebase value")
        res.send(snap.child(movieName).val())
        cache.put(movieName,snap.val());
        return
      }else{
        //Try to reach omdb api on result keyword, and save data on cache and firebase databse
        console.log("movieapi")
        request("https://www.omdbapi.com/?apikey="+apikey+ '&s=' + movieName, function(error, response, body){
          // Setup an if statement to catch any errors
          // which is optional but good practice 
          if(!error && response.statusCode == 200){
            // For now just print the body of the returned JSON
            console.log("getting movieapi value");
            console.log(JSON.parse(body));
            res.send(body);
            cache.put(movieName,body);
            let ref = db.ref('results').child(movieName);
            ref.set(JSON.parse(body));
            return
          }
        });
      }
    });
    return
  }
})
//Allow Access-Control-Allow-Origin, it's necessary because we are using the beckend and frontend in a differente domain.
app.use(cors(corsOptions));
