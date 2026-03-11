const { Op } = require("sequelize");
const db = require("../../models");
const News = db.news;
const helper = require("../../helper/helper");

exports.addNews = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return helper.failed(res, "Title and Content are required");
    }

    let image = "";

    if (req.files && req.files.image) {
      image = await helper.fileUpload(req.files.image);
    }

    const news = await News.create({
      title: title.trim(),
      content: content.trim(),
      image,
      status: "1",
    });

    return helper.success(res, "News added successfully", news);
  } catch (error) {
    console.log("ADD NEWS ERROR:", error);
    return helper.failed(res, error.message);
  }
};

exports.editNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, status } = req.body;

    const news = await News.findByPk(id);
    if (!news) return helper.notfound(res, "News not found");

    let image = news.image;

    if (req.files && req.files.image) {
      image = await helper.fileUpload(req.files.image);
    }

    await news.update({
      title,
      content,
      status,
      image,
    });

    return helper.success(res, "News updated successfully", news);
  } catch (error) {
    return helper.failed(res, error.message);
  }
};

exports.viewNews = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await News.findByPk(id);
    if (!news) return helper.notfound(res, "News not found");

    return helper.success(res, "News details", news);
  } catch (error) {
    return helper.failed(res, error.message);
  }
};

exports.newsList = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await News.findAndCountAll({
      where: {
        title: {
          [Op.like]: `%${search}%`,
        },
      },
      order: [["id", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    return helper.success(res, "News list", {
      data: rows,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    return helper.failed(res, error.message);
  }
};

exports.deleteNews = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await News.findByPk(id);
    if (!news) return helper.notfound(res, "News not found");

    await news.destroy();

    return helper.success(res, "News deleted successfully");
  } catch (error) {
    return helper.failed(res, error.message);
  }
};

exports.newsStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    if (!id) {
      return helper.failed(res, "ID is required");
    }
    const news = await News.findByPk(id);
    if (!news) return helper.notfound(res, "News not found");

    await news.update({ status });

    return helper.success(res, "Status updated successfully");
  } catch (error) {
    return helper.failed(res, error.message);
  }
};
