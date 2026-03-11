const db = require("../../models");
const { Op } = require("sequelize");
const helper = require("../../helper/helper");
const AgricultureListingImages = db.agriculture_listing_images;
const Agriculture_listings = db.agriculture_listings;

exports.addAgricultureImages = async (req, res) => {
  try {
    const { agriculture_listing_id } = req.body;

    if (!agriculture_listing_id)
      return helper.failed(res, "Listing id is required");

    if (!req.files || !req.files.images)
      return helper.failed(res, "Images are required");

    let images = req.files.images;
    if (!Array.isArray(images)) images = [images];

    let savedImages = [];

    for (let file of images) {
      const uploadedPath = await helper.fileUpload(file);

      const newImage = await AgricultureListingImages.create({
        agriculture_listing_id,
        image_url: uploadedPath,
      });

      savedImages.push(newImage);
    }

    return helper.success(res, "Images uploaded successfully", savedImages);
  } catch (error) {
    return helper.failed(res, error.message);
  }
};
exports.listAgricultureImages = async (req, res) => {
  try {
    let { page = 1, limit = 10, listing_id } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const offset = (pageNumber - 1) * limitNumber;

    let whereClause = {};

    if (listing_id) {
      whereClause.agriculture_listing_id = listing_id;
    }

    const { count, rows } = await Agriculture_listings.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: db.users,
          attributes: ["id", "name"],
          as: "agent",
        },
        {
          model: db.agriculture_listing_images,
          as: "agri_images",
        },
      ],
      order: [["id", "DESC"]],
      limit: limitNumber,
      offset: offset,
    });

    return helper.success(res, "Images list fetched successfully", {
      data: rows,
      totalPages: Math.ceil(count / limitNumber),
      totalRecords: count,
      currentPage: pageNumber,
    });
  } catch (error) {
    return helper.failed(res, error.message);
  }
};

// exports.viewAgricultureImage = async (req, res) => {
//   try {
//     const { agriculture_listing_id } = req.params;

//     const image = await AgricultureListingImages.findAll(
//       agriculture_listing_id,
//     );

//     if (!image) return helper.notfound(res, "Image not found");

//     return helper.success(res, "Image details", image);
//   } catch (error) {
//     return helper.failed(res, error.message);
//   }
// };

exports.viewAgricultureImage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return helper.failed(res, "Listing id is required");
    }

    const listing = await Agriculture_listings.findOne({
      where: { id: id },
      include: [
        {
          model: db.users,
          attributes: ["id", "name"],
          as: "agent",
        },
        {
          model: db.agriculture_listing_images,
          as: "agri_images",
        },
      ],
    });

    if (!listing) {
      return helper.notfound(res, "Listing not found");
    }

    return helper.success(res, "Image details", listing);
  } catch (error) {
    return helper.failed(res, error.message);
  }
};

exports.editAgricultureImages = async (req, res) => {
  try {
    const { agriculture_listing_id } = req.body;

    if (!agriculture_listing_id)
      return helper.failed(res, "Listing id required");

    if (!req.files || !req.files.images)
      return helper.failed(res, "Images required");

    const oldImages = await AgricultureListingImages.findAll({
      where: { agriculture_listing_id },
    });

    for (let img of oldImages) {
      const filePath = path.join(process.cwd(), "public", img.image_url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await AgricultureListingImages.destroy({
      where: { agriculture_listing_id },
    });

    let images = req.files.images;
    if (!Array.isArray(images)) images = [images];

    let updatedImages = [];

    for (let file of images) {
      const uploadedPath = await helper.fileUpload(file);

      const newImage = await AgricultureListingImages.create({
        agriculture_listing_id,
        image_url: uploadedPath,
      });

      updatedImages.push(newImage);
    }

    return helper.success(res, "Images updated successfully", updatedImages);
  } catch (error) {
    return helper.failed(res, error.message);
  }
};

exports.deleteAgricultureImage = async (req, res) => {
  try {
    const { id } = req.params;

    const image = await AgricultureListingImages.findByPk(id);
    if (!image) return helper.notfound(res, "Image not found");

    const filePath = path.join(process.cwd(), "public", image.image_url);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await image.destroy();

    return helper.success(res, "Image deleted successfully");
  } catch (error) {
    return helper.failed(res, error.message);
  }
};
