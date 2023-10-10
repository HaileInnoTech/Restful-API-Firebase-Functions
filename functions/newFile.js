const { app, db } = require(".");

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
        }
      );
      return res.status(200).send({ status: "Succesed", msg: " Data Updated" });
    }

    catch (error) {
      console.error();
      return res.status(500).send({ status: "Failed", msg: error });
    }
  }
  )();
});
