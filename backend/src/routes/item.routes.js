const router = require("express").Router();
const c = require("../controllers/item.controller");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

router.get("/", c.list);
router.get("/:id", c.get);
router.post("/", auth, upload.single("image"), c.create);
router.put("/:id", auth, upload.single("image"), c.update);
router.patch("/:id/claim", auth, c.claim);
router.delete("/:id", auth, c.remove);

module.exports = router;
