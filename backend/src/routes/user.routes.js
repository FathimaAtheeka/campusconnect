const router = require("express").Router();
const c = require("../controllers/user.controller");
const auth = require("../middleware/auth");
const requireRole = require("../middleware/role");

router.get("/", auth, requireRole("admin"), c.list);
router.patch("/:id/role", auth, requireRole("admin"), c.updateRole);
router.delete("/:id", auth, requireRole("admin"), c.remove);

module.exports = router;
