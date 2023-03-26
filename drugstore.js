const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const connection = mongoose.createConnection(
  "mongodb://localhost:27017/drugstore"
);

const drugSchema = new mongoose.Schema({
  name: {
    type: mongoose.Schema.Types.String,
    unique: true,
  },
  quantity: {
    type: mongoose.Schema.Types.Number,
    min: 0,
  },
});

const Drug = connection.model("Drug", drugSchema);

/*
A function which verifies the existance of the drug in the database
*/
async function searchDrugByName(req, res, next) {
  let drugName = req.fields.name;
  let drug = await Drug.findOne({ name: drugName });
  req.drug = drug;
  // console.log(drugs);
  next();
}
/*
Ajouter un nouveau médicament
Cas particuliers : 
- un médicament existe déjà
*/
router.post("/create", searchDrugByName, async (req, res) => {
  console.log(req.drug);
  if (req.drug) {
    res.status(400).json({ error: "Drug already exists" });
  } else {
    let drug = new Drug({
      name: req.fields.name,
      quantity: req.fields.quantity,
    });
    await drug.save();
    res.status(200).json(drug);
  }
});

/*
Obtenir l'état de l'inventaire
Cas particuliers :
- Aucun
*/
router.get("/inventory", async (req, res) => {
  let result = await Drug.find();
  res.status(200).json(result);
});

/*
Ajouter une quantité dans l'inventaire
Expections to be managed :
- Drug Id does not exist
*/

router.post("/drug/add", searchDrugByName, async (req, res) => {
  let input = req.fields;
  let searchResult = req.drug;
  if (searchResult) {
    req.drug.quantity += input.quantity;
    await req.drug.save();
    res.status(200).json(req.drug);
  } else {
    res.status(400).json({ error: "Drug does not exist" });
  }
});

/*
Retirer une quantité dans l'inventaire
Expections to be managed :
- Drug Id does not exist
- Quanity is greater than the stock
*/
router.post("/drug/remove", searchDrugByName, async (req, res) => {
  let input = req.fields;
  let searchResult = req.drug;
  if (searchResult) {
    if (searchResult.quantity >= input.quantity) {
      req.drug.quantity -= input.quantity;
      await req.drug.save();
      res.status(200).json(req.drug);
    } else {
      res.status(400).json({
        error: `Available quantity of ${searchResult.quantity} is less than requested quantity of ${input.quantity}`,
      });
    }
  } else {
    res.status(400).json({ error: "Drug does not exist" });
  }
});

/*
Get a drug quantity
*/

/*
Amend a drug's name
*/

/*
Delete a drug from the store
*/

/*
Save all modifications
*/

/*
Get the history of modifications
*/

module.exports = router;
