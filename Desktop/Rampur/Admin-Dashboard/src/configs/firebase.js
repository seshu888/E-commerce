import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyCeKAL2MVbTWfik3jGjf9G5a-rURhBuyV0",
  authDomain: "rampur-engineering.firebaseapp.com",
  projectId: "rampur-engineering",
  storageBucket: "rampur-engineering.appspot.com",
  messagingSenderId: "492451863656",
  appId: "1:492451863656:web:0ce0049fa730e9e5d72fdd",
  measurementId: "G-4WL9EEP8BQ"
};

  const firebaseIn = firebase.initializeApp(firebaseConfig);

  export default firebaseIn;