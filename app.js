const express = require('express')
var bodyParser = require('body-parser')
var admin = require("firebase-admin");
const app = express()
const cors = require("cors")

var serviceAccount = require("./tech-challenge-2ccfa-firebase-adminsdk-6scu7-5f55a9c7f4.json"); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tech-challenge-2ccfa-default-rtdb.firebaseio.com"
});

const corsOptions ={
  origin:'http://localhost:3000', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}

const db = admin.database();
const ref = db.ref('teste/saving-data/post');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => { console.log(`Server listening on port ${PORT}`); });

app.use(function(req, res, next){
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS" );
  next();
});

app.get('/', (req, res) => {
  res.send({"foo": "bar"});
});

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies

app.post('/favorites', function (req, res) {
  var post_body = req.body;
  console.log(post_body);
  console.log("hello");
  res.send({"foo": "bar"});

  const usersRef = ref.child('teste2');
  usersRef.set({post_body});

})
/*

const db = admin.database();
const ref = db.ref('teste/saving-data/post');


const usersRef = ref.child('users');
usersRef.set({
  alanisawesome: {
    date_of_birth: 'June 23, 1912',
    full_name: 'Alan Turing'
  },
  gracehop: {
    date_of_birth: 'December 9, 1906',
    full_name: 'Grace Hopper'
  }
});

app.get('/sms', (req,res)=>{   
     
  res.send({    
      
          user: '1234',
          contact: [
            {
              number: '534543543',
              message: 'test message 1',
              externalid: '123456'
            }
          ],
          type: '2'      
  })
}) */

app.use(cors(corsOptions));
/*
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode).json(err);
});
*/
