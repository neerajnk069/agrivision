const db = require("../../models");
const helper = require("../../helper/helper");
const { Op } = require("sequelize");

module.exports = {
  contactGet: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const search = req.query.search || "";
      const dateFilter = req.query.dateFilter || "all";

      const whereCondition = search
        ? {
            [Op.or]: [
              { name: { [Op.like]: `%${search}%` } },
              { email: { [Op.like]: `%${search}%` } },
            ],
          }
        : {};

      if (dateFilter !== "all") {
        const daysAgo = parseInt(dateFilter, 10);
        if (!isNaN(daysAgo)) {
          const startDate = new Date();
          startDate.setDate(startDate.getDate() - daysAgo);

          whereCondition.createdAt = {
            [Op.gte]: startDate,
          };
        }
      }

      const totalContacts = await db.inquiries.count({ where: whereCondition });

      const data = await db.inquiries.findAll({
        where: whereCondition,
        limit,
        offset,
        order: [["id", "DESC"]],
      });

      return helper.success(res, "All contact details", {
        data,
        total: totalContacts,
        page,
        limit,
        totalPages: Math.ceil(totalContacts / limit),
      });
    } catch (error) {
      return helper.failed(res, "Something went wrong", error);
    }
  },
  contactView: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await db.inquiries.findByPk(id);
      return res.status(200).json({ message: true, data });
    } catch (error) {
      return helper.failed(res, "Something went wrong", error);
    }
  },
  contactDelete: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await db.inquiries.destroy({ where: { id } });
      return helper.success(res, "Contact deleted successfully");
    } catch (error) {
      return helper.failed(res, "Something went wrong", error);
    }
  },
};
