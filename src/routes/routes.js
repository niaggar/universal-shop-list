const { Router } =  require("express");
const router = Router();

router.get("/", (req, res) => {
  res.render("pages/index")
});

router.get("/add/:name/:price/:div", (req, res) => {
  res.send("added");
});

module.exports = router;
