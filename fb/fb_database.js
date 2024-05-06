const { getDatabase, ref, get, child, onValue, set, update } = require("firebase/database");
const { fb_app } = require("./firebase");

const db = getDatabase(fb_app);



module.exports = { db, ref, get, child, onValue, set, update };