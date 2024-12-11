const Menu = require("../../../models/menu");
const { uploadOnCloudinary, deleteFromCloudinary } = require("../../../config/cloudinary");
const fs = require("fs"); // Import the fs module
function menuController() {
    return {
        // Show all menu items
        async index(req, res) {
            try {
                console.log("Fetching all menu items...");
                const menuItems = await Menu.find();
                console.log("Menu items fetched:", menuItems);
                res.render("admin/menus", { menuItems });
            } catch (err) {
                console.error("Error fetching menu items:", err);
                res.status(500).send("Internal Server Error");
            }
        },

        // Render form to create a new menu item
        create(req, res) {
            console.log("Rendering create menu form...");
            res.render("admin/createMenu");
        },

        // Store new menu item
        async store(req, res) {
            const { name, price, size } = req.body;
            const file = req.file;

            console.log("Received data for new menu item:", { name, price, size, file });

            // Validate input fields
            if (!name || !file || !price || !size) {
                console.error("Validation failed: All fields are required");
                req.flash("error", "All fields are required");
                return res.redirect("/admin/menu/create");
            }

            // Ensure file upload success
            if (!req.file) {
                console.error("File upload failed: No file received");
                return res.status(400).send("File upload failed");
            }

            try {
                console.log("Uploading file to Cloudinary...");
                const uploadResponse = await uploadOnCloudinary(file.path);

                if (!uploadResponse || !uploadResponse.secure_url) {
                    console.error("File upload to Cloudinary failed:", uploadResponse);
                    req.flash("error", "Failed to upload image. Please try again.");
                    return res.redirect("/admin/menu/create");
                }

                const imageUrl = uploadResponse.secure_url;
                console.log("File uploaded to Cloudinary:", imageUrl);

                const menuItem = new Menu({
                    name,
                    image: imageUrl,
                    price,
                    size,
                });

                console.log("Saving new menu item to database...");
                await menuItem.save();
                console.log("Menu item saved:", menuItem);

                req.flash("success", "Menu item created successfully");
                res.redirect("/admin/menu");
            } catch (err) {
                console.error("Error while saving menu item:", err);
                req.flash("error", "Something went wrong while saving menu item.");
                res.redirect("/admin/menu/create");
            }
        },

        // Render form to edit an existing menu item
        async edit(req, res) {
            try {
                console.log("Fetching menu item for edit:", req.params.id);
                const menuItem = await Menu.findById(req.params.id);
                if (!menuItem) {
                    console.error("Menu item not found:", req.params.id);
                    return res.status(404).send("Menu item not found");
                }
                console.log("Rendering edit menu form for item:", menuItem);
                res.render("admin/editMenu", { menuItem });
            } catch (err) {
                console.error("Error fetching menu item for edit:", err);
                res.status(500).send("Internal Server Error");
            }
        },
        // Update an existing menu item
        async update(req, res) {
          const { name, price, size } = req.body;
          const file = req.file;
      
          console.log("Updating menu item:", req.params.id, { name, price, size, file });
      
          try {
              const menuItem = await Menu.findById(req.params.id);
              if (!menuItem) {
                  return res.status(404).send("Menu item not found");
              }
      
              if (file) {
                  console.log("New file uploaded, updating Cloudinary image...");
                  const publicId = menuItem.image.split("/").pop().split(".")[0];
                  console.log("Here is publicId", publicId);
                  await deleteFromCloudinary(publicId);
      
                  const uploadResponse = await uploadOnCloudinary(file.path);
                  menuItem.image = uploadResponse.secure_url;
                  console.log("Updated image URL:", menuItem.image);
      
                  // Cleanup local file asynchronously and handle errors
                  fs.unlink(file.path, (err) => {
                      if (err) {
                          console.error(`Error deleting file: ${file.path}`, err);
                      } else {
                          console.log(`File deleted successfully: ${file.path}`);
                      }
                  });
              }
      
              menuItem.name = name;
              menuItem.price = price;
              menuItem.size = size;
      
              console.log("Saving updated menu item...");
              await menuItem.save();
              console.log("Menu item updated:", menuItem);
      
              req.flash("success", "Menu item updated successfully");
              res.redirect("/admin/menu");
          } catch (err) {
              console.error("Error updating menu item:", err);
              req.flash("error", "Something went wrong while updating menu item.");
              res.redirect("/admin/menu");
          }
        },
      

        // Delete a menu item
        async delete(req, res) {
            try {
                console.log("Deleting menu item:", req.params.id);
                const menuItem = await Menu.findById(req.params.id);

                if (!menuItem) {
                    console.error("Menu item not found:", req.params.id);
                    return res.status(404).send("Menu item not found");
                }

                // Delete image from Cloudinary
                const publicId = menuItem.image.split("/").pop().split(".")[0];
                console.log("Deleting image from Cloudinary:", publicId);
                await deleteFromCloudinary(publicId);

                console.log("Deleting menu item from database...");
                await Menu.findByIdAndDelete(req.params.id);
                console.log("Menu item deleted:", req.params.id);

                req.flash("success", "Menu item deleted successfully");
                res.redirect("/admin/menu");
            } catch (err) {
                console.error("Error deleting menu item:", err);
                req.flash("error", "Something went wrong while deleting menu item.");
                res.redirect("/admin/menu");
            }
        },
    };
}

module.exports = menuController;
