const mysql = require('mysql');
const moment = require('moment');
var sleep = require('system-sleep');
var sys = require("util");
var admin = require("firebase-admin");

var serviceAccount = require("./notif.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://qr-notif.firebaseio.com"
});

var registrationToken = "dN2B_tXxwwQ:APA91bEj5Lipmn7HaP0FHPT55FQvMVtq4tN2QH8Mi-DbTMSmBfViZPt_a819BqhjXz-qMkEXghWBfNnHEGC8xvBMvaZYvIYvuQMMNGhkF6eOwcrLGfb8meWZEVb2-MATMIJKEN4mMHw9";
var payload = {
  notification: {
    title: "hola",
    body: "holaaaaaa"
  }
};
var options = {
 priority: "high",
 timeToLive: 60 * 60 *24
};

const db = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'reservas'
});

// connect to database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
global.db = db;

//SELECT * FROM reserva where reserva.res_fecha = "2020-04-28" and reserva.res_hora_ini >= "22:55:00" and reserva.res_hora_ini <= "22:55:59"
let currentTime = moment().add(5,'minutes').format('hh:mm');
let min = currentTime + ":00";
let max = currentTime + ":59";
console.log(min+"-"+max);

function doStuff() {
  let hora_actual = moment().add(5,'minutes').format('hh:mm');
  let fecha = moment().format("YYYY-MM-DD");
  let min = hora_actual + ":00";
  let max = hora_actual + ":59";
  console.log(min+"-"+max);
  let query = "SELECT reserva.res_id_sal FROM reserva where reserva.res_fecha = '2020-04-28' and reserva.res_hora_ini >= '"+ min +"' and reserva.res_hora_ini <= '"+max+"'";
  // execute query
  //SELECT * FROM reserva where reserva.res_fecha = "2020-04-28" and reserva.res_hora_ini >= "22:55:00" and reserva.res_hora_ini <= "22:55:59"
  db.query(query, function (err, result, fields) {
    if (err) throw err;
      console.log(result);
      admin.messaging().sendToDevice(registrationToken, payload, options)
        .then(function(response) {
          console.log("Successfully sent message:", response);
        })
        .catch(function(error) {
          console.log("Error sending message:", error);
        });

  });

};

function run() {
  setInterval(doStuff, 59000);
};

run();
