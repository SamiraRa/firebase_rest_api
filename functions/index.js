const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

const serviceAccount = require("./permissions.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-rest-api-b545b.firebaseio.com",
});

const app = express();
const db = admin.firestore();

app.use(cors({origin: true}));

app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

app.post("/api/create", (req, res) => {
  (async () => {
    try {
      await db.collection("products").doc("/" + 1 + "/").create({
        name: req.body.name,
        desc: req.body.desc,
        price: req.body.price,
      });
      return res.status(200).send();
    } catch (e) {
      res.status(404).send(e);
    }
  })();
});

app.get("/api/read/:ID", (req, res) => {
  (async () => {
    try {
      const document = db.collection("products").doc(req.params.ID);
      const product = await document.get();
      const response = product.data();
      return res.status(200).send(response);
    } catch (e) {
      return res.status(404).send(e);
    }
  })();
});

app.get("/api/read", (req, res) => {
  (async () => {
    try {
      const query = db.collection("products");
      const response = [];

      const querySnapshot = await query.get();
      const docs = querySnapshot.docs;

      for (const doc of docs) {
        const selectedItem = {
          id: doc.id,
          name: doc.data().name,
          desc: doc.data().desc,
          price: doc.data().price,
        };
        response.push(selectedItem);
      }

      return res.status(200).send(response);
    } catch (e) {
      return res.status(404).send(e);
    }
  })();
});

app.put("/api/read/:ID", (req, res) => {
  (async () => {
    try {
      const document = db.collection("products").doc(req.params.ID);

      await document.update({
        name: req.body.name,
        desc: req.body.desc,
        price: req.body.price,
      });

      return res.status(200).send({
        ret_str: "Updated Successfully",
      });
    } catch (e) {
      return res.status(500).send(e);
    }
  })();
});

app.delete("/api/read/:ID", (req, res) => {
  (async () => {
    try {
      const document = db.collection("products").doc(req.params.ID);
      await document.delete();

      return res.status(200).send({
        ret_str: `The ${req.params.ID} has been Deleted Successfully`,
      });
    } catch (e) {
      return res.status(500).send(e);
    }
  })();
});

exports.app = functions.https.onRequest(app);
