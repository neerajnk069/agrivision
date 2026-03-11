const { Op } = require("sequelize");
const db = require("../../models");
const Services = db.services;
const helper = require("../../helper/helper");

exports.addService = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return helper.failed(res, "Title and Description are required");
    }

    let image = "";

    if (req.files && req.files.image) {
      image = await helper.fileUpload(req.files.image);
    }

    const service = await Services.create({
      title: title.trim(),
      description: description.trim(),
      image,
      status: "1",
    });

    return helper.success(res, "Service added successfully", service);
  } catch (error) {
    console.log("ADD Services error:", error);
    return helper.failed(res, error.message);
  }
};

exports.editService = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const service = await Services.findByPk(id);
    if (!service) return helper.notfound(res, "Service not found");

    let image = service.image;

    if (req.files && req.files.image) {
      image = await helper.fileUpload(req.files.image);
    }

    await service.update({
      title,
      description,
      status,
      image,
    });

    return helper.success(res, "Service updated successfully", service);
  } catch (error) {
    return helper.failed(res, error.message);
  }
};

exports.viewService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Services.findByPk(id);
    if (!service) return helper.notfound(res, "Service not found");

    return helper.success(res, "Service details", service);
  } catch (error) {
    return helper.failed(res, error.message);
  }
};

exports.serviceList = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Services.findAndCountAll({
      where: {
        title: {
          [Op.like]: `%${search}%`,
        },
      },
      order: [["id", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    return helper.success(res, "Service list", {
      data: rows,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    return helper.failed(res, error.message);
  }
};

exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Services.findByPk(id);
    if (!service) return helper.notfound(res, "Service not found");

    await service.destroy();

    return helper.success(res, "Service deleted successfully");
  } catch (error) {
    return helper.failed(res, error.message);
  }
};

exports.serviceStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    console.log(req.body, ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    if (!id) {
      return helper.failed(res, "ID is required");
    }
    const services = await Services.findByPk(id);
    if (!services) return helper.notfound(res, "News not found");

    await services.update({ status });

    return helper.success(res, "Services status updated successfully");
  } catch (error) {
    return helper.failed(res, error.message);
  }
};
