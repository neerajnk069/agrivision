const { Op } = require("sequelize");
const db = require("../../models");
const Agriculture_listings = db.agriculture_listings;
const helper = require("../../helper/helper");

exports.addAgriculture = async (req, res) => {
  try {
    const { title, description, agent_id, approved_by } = req.body;

    if (!title || !description) {
      return helper.failed(res, "Title and Description are required");
    }

    const agriculture = await Agriculture_listings.create({
      title: title.trim(),
      description: description.trim(),
      status: "pending",
      agent_id,
      approved_by,
    });

    return helper.success(res, "Agriculture added successfully", agriculture);
  } catch (error) {
    console.log("ADD Agriculture error:", error);
    return helper.failed(res, error.message);
  }
};

exports.editAgriculture = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, agent_id, approved_by, status } = req.body;

    const agriculture = await Agriculture_listings.findByPk(id);
    if (!agriculture) return helper.notfound(res, "Agriculture not found");

    await agriculture.update({
      title,
      description,
      status,
      agent_id,
      approved_by,
    });

    return helper.success(res, "Agriculture updated successfully", agriculture);
  } catch (error) {
    return helper.failed(res, error.message);
  }
};

exports.viewAgriculture = async (req, res) => {
  try {
    const { id } = req.params;

    const agriculture = await Agriculture_listings.findByPk(id, {
      include: [
        {
          model: db.users,
          as: "agent",
        },
      ],
    });

    if (!agriculture) return helper.notfound(res, "Agriculture not found");

    return helper.success(res, "Agriculture details", agriculture);
  } catch (error) {
    return helper.failed(res, error.message);
  }
};

exports.agricultureList = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "" } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const offset = (pageNumber - 1) * limitNumber;

    const whereClause = {};

    if (search) {
      whereClause.title = {
        [Op.like]: `%${search}%`,
      };
    }

    const { count, rows } = await Agriculture_listings.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: db.users,
          as: "agent",
        },
      ],
      order: [["id", "DESC"]],
      limit: limitNumber,
      offset: offset,
    });

    return helper.success(res, "Agriculture list", {
      data: rows,
      totalPages: Math.ceil(count / limitNumber),
      totalRecords: count,
    });
  } catch (error) {
    return helper.failed(res, error.message);
  }
};

exports.deleteAgriculture = async (req, res) => {
  try {
    const { id } = req.params;

    const agriculture = await Agriculture_listings.findByPk(id);
    if (!agriculture) return helper.notfound(res, "Agriculture not found");

    await agriculture.destroy();

    return helper.success(res, "Agriculture deleted successfully");
  } catch (error) {
    return helper.failed(res, error.message);
  }
};

exports.updateAgricultureStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status value",
      });
    }

    const listing = await Agriculture_listings.findOne({
      where: { id },
    });

    if (!listing) {
      return res.status(404).json({
        message: "Listing not found",
      });
    }

    await listing.update({ status });

    res.status(200).json({
      message: "Status updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
