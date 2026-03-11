const db = require('../../models');
const helper = require('../../helper/helper');

module.exports = {
    privacy_policy: async (req, res) => {
        try {
            let data = await db.cms.findOne({ where: { type: 1 } });
            return res.status(200).json({ message: "Privacy policy retrieved successfully.", data });
        } catch (error) {
            return helper.failed(res, error)
        }
    },
    privacypolicy: async (req, res) => {
        try {
            const { content, description } = req.body;
            await db.cms.update({ content, description }, { where: { type: 1 } });
            return res.status(200).json({ message: "Privacy policy updated successfully." });
        } catch (error) {
            return helper.failed(res, error)
        }
    },
    aboutus: async (req, res) => {
        try {
            let data = await db.cms.findOne({ where: { type: 2 } });
            return res.status(200).json({ message: "About Us retrieved successfully.", data });
        } catch (error) {
            return helper.failed(res, error)
        }
    },
    updateabout: async (req, res) => {
        try {
            const { content, description } = req.body;
            await db.cms.update({ content, description }, { where: { type: 2 } });
            return res.status(200).json({ message: "About Us updated successfully." });
        } catch (error) {
            return helper.failed(res, error)
        }
    },
    term: async (req, res) => {
        try {
            let data = await db.cms.findOne({ where: { type: 3 } });
            return res.status(200).json({ message: "Terms and Conditions retrieved successfully.", data });
        } catch (error) {
            return helper.failed(res, error)
        }
    },
    updateterm: async (req, res) => {
        try {
            const { content, description } = req.body;
            await db.cms.update({ content, description }, { where: { type: 3 } });
            return res.status(200).json({ message: "Terms and Conditions updated successfully." });
        } catch (error) {
            return helper.failed(res, error)
        }
    }
};
