import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            console.error("❌ No local file path provided");
            return null;
        }

        // console.log("📤 Uploading file:", localFilePath);

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: "ecommerce_uploads",
        });

        // console.log("✅ Uploaded successfully:", response.secure_url);

        fs.unlinkSync(localFilePath);

        return response;
    } catch (error) {
        console.error("❌ Cloudinary upload error:", error.message);
        console.error(error);
        return null;
    }
};
