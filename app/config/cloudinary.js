// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

// Cloudinary configuration
cloudinary.config({
    cloud_name: "dtptlumxk",
    api_key: "381283837129843",
    api_secret: "UAn1rxlF3oFafKVw5p4WcQjMgT0",
    secure: false,  // Use HTTP instead of HTTPS (only for testing)
});

// Upload function
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) throw new Error("File path is missing!");

        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "image", // Ensure it's uploaded as an image
        });

        // Remove the local file after upload
        fs.unlinkSync(localFilePath);

        return response;
    } catch (error) {
        console.error("Error uploading file to Cloudinary:", error.message);

        // // Remove the local file if upload fails
        // if (fs.existsSync(localFilePath)) {
        //     fs.unlinkSync(localFilePath);
        // }

        throw error;
    }
};

// Function to delete image from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
  } catch (error) {
      console.error("Error deleting from Cloudinary:", error.message);
      throw error;
  }
};

module.exports = { uploadOnCloudinary, deleteFromCloudinary };


