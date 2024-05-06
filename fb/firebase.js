const { initializeApp } = require("firebase/app");
const firebaseConfig = {
    // apiKey: "AIzaSyBfg4kDxFL3LGUjsur9TTNHe2trBN5rL9Y",
    // authDomain: "website-academy.firebaseapp.com",
    // projectId: "website-academy",
    // storageBucket: "website-academy.appspot.com",
    // messagingSenderId: "698067583674",
    // appId: "1:698067583674:web:cf3c03178294272f28f883",
    // measurementId: "G-1F74ZX39CC"


    apiKey: "AIzaSyCnOBNEM40_-xkVblXZejf3Ioia2GlbGMI",
    authDomain: "ltnc-6b341.firebaseapp.com",
    databaseURL: "https://ltnc-6b341-default-rtdb.firebaseio.com",
    projectId: "ltnc-6b341",
    storageBucket: "ltnc-6b341.appspot.com",
    messagingSenderId: "69708357852",
    appId: "1:69708357852:web:b52de07b6e1a58a2115419",
    measurementId: "G-SX3ZLK2LWT"
  };

// Initialize Firebase
const fb_app = initializeApp(firebaseConfig);

module.exports = fb_app;
