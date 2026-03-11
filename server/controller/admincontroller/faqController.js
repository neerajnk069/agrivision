const db = require("../../models");
const helper = require("../../helper/helper");
const { Validator } = require("node-input-validator");

const Faq = db.faqs;

module.exports = {
  addFaq: async (req, res) => {
    try {
      const validator = new Validator(req.body, {
        question: "required",
        answer: "required",
      });

      const errorMessage = await helper.checkValidation(validator);
      if (errorMessage) {
        return helper.failed(res, errorMessage);
      }

      const { question, answer } = req.body;

      const faq = await Faq.create({
        question,
        answer,
      });

      return helper.success(res, "FAQ added successfully", faq);
    } catch (error) {
      console.error("addFaq Error:", error);
      return helper.error(res, "Server Error");
    }
  },

  viewFaq: async (req, res) => {
    try {
      const { id } = req.params;

      const faq = await Faq.findByPk(id);

      if (!faq) {
        return helper.notfound(res, "FAQ not found");
      }

      return helper.success(res, "FAQ details fetched", faq);
    } catch (error) {
      console.error("viewFaq Error:", error);
      return helper.error(res, "Server Error");
    }
  },

  updateFaq: async (req, res) => {
    try {
      const { id } = req.params;

      const faq = await Faq.findByPk(id);

      if (!faq) {
        return helper.notfound(res, "FAQ not found");
      }

      faq.question = req.body.question || faq.question;
      faq.answer = req.body.answer || faq.answer;

      await faq.save();

      return helper.success(res, "FAQ updated successfully", faq);
    } catch (error) {
      console.error("updateFaq Error:", error);
      return helper.error(res, "Server Error");
    }
  },

  deleteFaq: async (req, res) => {
    try {
      const { id } = req.params;

      const faq = await Faq.findByPk(id);

      if (!faq) {
        return helper.notfound(res, "FAQ not found");
      }

      await faq.destroy();

      return helper.success(res, "FAQ deleted successfully");
    } catch (error) {
      console.error("deleteFaq Error:", error);
      return helper.error(res, "Server Error");
    }
  },

  getFaqs: async (req, res) => {
    try {
      const faqs = await Faq.findAll({
        order: [["createdAt", "DESC"]],
      });

      return helper.success(res, "All FAQs fetched", faqs);
    } catch (error) {
      console.error("getFaqs Error:", error);
      return helper.error(res, "Server Error");
    }
  },
};
