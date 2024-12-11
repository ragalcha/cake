const express = require("express");
const router = express.Router();
const menuController = require("../app/http/controllers/admin/menuController")();
const { upload } = require("../app/http/middlewares/multer");

// Routes for menu management
router.get("/", menuController.index); // Show all menu items
router.get("/create", menuController.create); // Form to create new menu item
router.post("/store", (req, res) => {
  upload.single("image")(req, res, (err) => {
      if (err) {
          console.error("Multer error:", err);
          return res.status(400).send("File upload error: " + err.message);
      }

      menuController.store(req, res);
  });
});
 // Store new menu item
router.get("/:id/edit", menuController.edit); // Form to edit menu item
router.post("/:id/update", upload.single("image"), menuController.update); // Update menu item
router.post("/:id/delete", menuController.delete); // Delete menu item

module.exports = router;
