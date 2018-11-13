
$( document ).ready(function() {
  
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyB4XCTop1k3fmY5iJCL-qik9RDM6rtq3YM",
    authDomain: "train-time-hw7.firebaseapp.com",
    databaseURL: "https://train-time-hw7.firebaseio.com",
    projectId: "train-time-hw7",
    storageBucket: "train-time-hw7.appspot.com",
    messagingSenderId: "816277961556"
  };
  
  firebase.initializeApp(config);


// Create a variable to reference the database
var database = firebase.database();

// Initial Variables (SET the first set IN FIREBASE FIRST)
// Note remember to create these same variables in Firebase!
var train = "";
var dest = "";
var frequency = "";
var firstArrival = "";
var minAway = "";


// Click Button changes what is stored in firebase
$("#submit-btn").on("click", function (event) {
  // Prevent the page from refreshing
  event.preventDefault();

  // Get inputs
  train = $("#tName-input").val().trim();
  dest = $("#dest-input").val().trim();
  firstArrival = $("#firstArrival-input").val().trim();
  frequency = $("#frequency-input").val().trim();
  //minAway = arrival.getMinutes() / frequency;

    // Data validation on date 
  if (moment(firstArrival,  "hh:mm").isValid() != true) {
    alert ("please input a valid date (HH:mm)")
  } else {

  //Change what is saved in firebase
  database.ref().push({
    train: train,
    dest: dest,
    frequency: frequency,
    firstArrival: firstArrival,
  });
  };


});


database.ref().on("child_added", function (childSnapshot) {
     
     // must let moment.js know we only care about hours and min
      let arrFormat = "hh:mm";
      let nextArrival = moment(childSnapshot.val().firstArrival, arrFormat);
      let waitTime = 0; 
     
     // if the train has not arrived yet ...
  if (moment().isBefore(nextArrival) === true){
    // Arrival time is the difference between the next arrival and now in minutes
    waitTime = nextArrival.diff(moment(), "minutes");
  }  
  //Otherwise the train will not have arrived yet
  else {
  // find out how log it has been since the train came the first time
  let minPast =  Number(nextArrival.diff(moment(), "minutes")) 
  
  // the wait time will be the the remainder of the amount of miniuts and the frequency with which the train comes
  let waitMod = minPast % Number(childSnapshot.val().frequency);
  waitTime = Number(childSnapshot.val().frequency) + waitMod;
  
  //calculate a new next arrival time
  nextArrival = moment().add({minutes: waitTime});
  
  };

  // poplate the table with database info and calulated info
  $(".table").append(
    // display the train name from DB
    "<tr class='trainInfo'><td class='timing'> " + childSnapshot.val().train +
    // display the destination from DB
    " </td><td class='train-name'> " + childSnapshot.val().dest +
    // display the frequency from DB
    " </td><td class='train-frequency'> " + childSnapshot.val().frequency +
    // desplay the arrival time (caulated above)
    " </td><td class='train-arrival'> " + nextArrival.format("hh:mm") +
     // desplay the wait time (caulated above)
    " </td><td class='train-arrival'> " + waitTime +
    " </td></tr>");

  });

database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function (snapshot) {


  $("#tName-input").text(snapshot.val().train);
  $("#dest-input").text(snapshot.val().dest);
  $("#firstArrival-input").text(snapshot.val().frequency);
  $("#frequency-input").text(snapshot.val().arrival);
});

});