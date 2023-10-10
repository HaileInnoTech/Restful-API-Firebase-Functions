const functions = require("firebase-functions");

const admin = require("firebase-admin");

const serviceAccount = require("./auth.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors({ origin: true }));
app.get("/", (req, res) => {
  return res.status(200).send("How is your day going");
});
const db = admin.firestore();
// CREATE DATA >> POST()
app.post("/api/create", (req, res) => {
  (async () => {
    try {
      await db.collection("userDetails").doc(`/${Date.now()}/`).create(
        {
          id: Date.now(),
          name: req.body.name,
          mobile: req.body.mobile,
          address: req.body.address,
        },
      );
      return res.status(200).send({ status: "Succesed", msg: "Data saved" });
    } catch (error) {
      console.error();
      return res.status(500).send({ status: "Failed", msg: error });
    }
  })();
});
// READ DATA >> GETALL GET()
app.get("/api/getAll", (req, res) => {
  (async () => {
    try {
      const query = db.collection("userDetails");
      const response = [];
      await query.get().then((data) => {
        const docs = data.docs;
        docs.map((doc) => {
          const selectedItem = {
            id: doc.data().id,
            name: doc.data().name,
            mobile: doc.data().mobile,
            address: doc.data().address,
          };
          response.push(selectedItem);
        });
        return response;
      });
      return res.status(200).send({ status: "Success", msg: response });
    } catch (error) {
      console.error();
      return res.status(500).send({ status: "Failed", msg: error });
    }
  })();
});
// READ DATA >> GET SINGLE ITEM BY ID
app.get("/api/get/:id", (req, res) => {
  (async () => {
    try {
      const reqDoc = db.collection("userDetails").doc(req.params.id);
      const userDetails = await reqDoc.get();
      const response = userDetails.data();
      return res.status(200).send({ status: "Success", data: response });
    } catch (error) {
      console.error();
      return res.status(500).send({ status: "Failed", msg: error });
    }
  }
  )();
});
// UPDATE DATA >> PUT() SINGLE ITEM BY ID
app.put("/api/update/:id", (req, res) => {
  (async () => {
    try {
      const reqDoc = db.collection("userDetails").doc(req.params.id);
      await reqDoc.update(
        {
          name: req.body.name,
          mobile: req.body.mobile,
          address: req.body.address,
          // eslint-disable-next-line comma-dangle
        });
      return res.status(200).send({ status: "Succesed", msg: " Data Updated" });
    }

    catch (error) {
      console.error();
      return res.status(500).send({ status: "Failed", msg: error });
    }
  }
  )()
});

// DELETE DATA >> DELETE ITEM BY ID
app.delete("/api/delete/:id", (req, res) => {
  (async () => {
    try {
      const reqDoc = db.collection("userDetails").doc(req.params.id);
      await reqDoc.delete();
      // eslint-disable-next-line max-len
      return res.status(200).send({ status: "Success", msg: "Delete Successfully" });
    } catch (error) {
      console.error();
      return res.status(500).send({ status: "Failed", msg: error });
    }
  }
  )();
});

app.post("/api/createfp", (req, res) => {
  (async () => {
    try {
      await db.collection("fingerprintDB").doc(req.body.id).create(
        {
          id: req.body.id,
          name: req.body.name,
          data: req.body.data,
        },
      );
      return res.status(200).send({ status: "Succesed", msg: "Data saved" });
    } catch (error) {
      console.error();
      return res.status(500).send({ status: "Failed", msg: error });
    }
  })();
});

app.get("/api/getAllfp", (req, res) => {
  (async () => {
    try {
      const query = db.collection("fingerprintDB");
      const response = [];
      await query.get().then((data) => {
        const docs = data.docs;
        docs.map((doc) => {
          const selectedItem = {
            id: doc.data().id,
            name: doc.data().name,
            data: doc.data().data,
          };
          response.push(selectedItem);
        });
        return response;
      });
      return res.status(200).send({ status: "Success", msg: response });
    } catch (error) {
      console.error();
      return res.status(500).send({ status: "Failed", msg: error });
    }
  })();
});


exports.app = functions.https.onRequest(app);
