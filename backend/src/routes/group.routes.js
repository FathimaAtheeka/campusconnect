const router = require("express").Router();
const c = require("../controllers/group.controller");
const auth = require("../middleware/auth");

router.get("/", c.list);
router.get("/:id", c.get);
router.post("/", auth, c.create);
router.put("/:id", auth, c.update);
router.post("/:id/join", auth, c.join);
router.post("/:id/leave", auth, c.leave);
router.delete("/:id", auth, c.remove);

module.exports = router;
