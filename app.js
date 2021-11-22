const express = require('express')
const app = express()
const cors = require("cors")

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => { console.log(`Server listening on port ${PORT}`); });

app.get('/', (req, res) => {
  res.send("Hello World")
});

var admin = require("firebase-admin");

var serviceAccount = require("./tech-challenge-2ccfa-firebase-adminsdk-6scu7-5f55a9c7f4.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tech-challenge-2ccfa-default-rtdb.firebaseio.com"
});

const db = admin.database();
const ref = db.ref('server/saving-data/fireblog');

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
/*
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode).json(err);
});
*/
