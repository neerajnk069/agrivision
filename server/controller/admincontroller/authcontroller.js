const db = require("../../models");
const bcrypt = require("bcryptjs");
const helper = require("../../helper/helper");
const { Validator } = require("node-input-validator");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

module.exports = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return helper.failed(res, "Email and Password are required.");
      }

      const userData = await db.users.findOne({ where: { email } });

      if (!userData) {
        return helper.failed(res, "Invalid Email and Password.");
      }
      const isPasswordValid = await bcrypt.compare(password, userData.password);
      if (!isPasswordValid) {
        return helper.failed(res, "Invalid Email and Password.");
      }

      const secret = process.env.JWT_SECRET;
      const token = jwt.sign(
        {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          image: userData.image,
        },
        secret,
      );

      const userResponse = { ...userData.toJSON() };
      delete userResponse.password;

      return helper.success(res, "Login successfully", {
        ...userResponse,
        token,
      });
    } catch (error) {
      return helper.failed(res, error.message);
    }
  },
  profile: async (req, res) => {
    try {
      const userId = req.admin.id;
      const find_user = await db.users.findByPk(userId, {});
      return helper.success(res, "Profile fetched successfully", find_user);
    } catch (error) {
      return helper.failed(res, error.message);
    }
  },
  edit_profile: async (req, res) => {
    try {
      const userId = req.admin.id;
      const find_user = await db.users.findByPk(userId);
      if (!find_user) {
        return helper.failed(res, "User not found", 403);
      }
      let imagePath = find_user.image;
      if (req.files && req.files.image) {
        imagePath = await helper.fileUpload(req.files.image);
      }
      await db.users.update(
        {
          name: req.body.name || find_user.name,
          location: req.body.location || find_user.location,
          phoneNumber: req.body.phoneNumber || find_user.phoneNumber,
          countryCode: req.body.countryCode || find_user.countryCode,
          adminCommission:
            req.body.adminCommission || find_user.adminCommission,
          image: imagePath,
        },
        { where: { id: userId } },
      );
      const updatedProfile = await db.users.findByPk(userId, {});

      return helper.success(
        res,
        "Profile updated successfully",
        updatedProfile,
      );
    } catch (error) {
      return helper.failed(res, error.message);
    }
  },
  reset_password: async (req, res) => {
    try {
      const { password, newPassword } = req.body;
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        return helper.failed(res, "No token provided");
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      const find_data = await db.users.findByPk(userId);
      if (!find_data) {
        return helper.failed(res, "User not found");
      }

      const isPasswordMatch = await bcrypt.compare(
        password,
        find_data.password,
      );
      if (!isPasswordMatch) {
        return helper.failed(res, "Old password is incorrect");
      }
      const isNewSameAsOld = await bcrypt.compare(
        newPassword,
        find_data.password,
      );
      if (isNewSameAsOld) {
        return helper.failed(
          res,
          "New password cannot be the same as the old password",
        );
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      await db.users.update(
        { password: hashedNewPassword },
        { where: { id: userId } },
      );

      return helper.success(res, "Password changed successfully");
    } catch (error) {
      return helper.failed(res, error.message);
    }
  },
  logout: async (req, res) => {
    try {
      return helper.success(
        res,
        "Logged out successfully. Please clear the token on the client side.",
      );
    } catch (error) {
      return helper.failed(res, error.message);
    }
  },
  dashboard: async (req, res) => {
    try {
      let users = await db.users.count({ where: { role: "1" } });
      let agents = await db.users.count({ where: { role: "2" } });
      let inquiry = await db.inquiries.count();

      return helper.success(res, "Dashboard data fetched successfully", {
        users,
        agents,
        inquiry,
      });
    } catch (error) {
      console.log("DASHBOARD ERROR:", error);
      return helper.failed(res, "Error fetching dashboard data", error.message);
    }
  },
  chartData: async (req, res) => {
    try {
      const { period } = req.query;
      const currentYear = new Date().getFullYear();

      let data = [];
      let categories = [];

      const getDateRange = (period) => {
        const now = new Date();
        const endDate = new Date();

        let startDate = new Date();

        switch (period) {
          case "last_week":
            startDate.setDate(now.getDate() - 7);
            break;
          case "last_month":
            startDate.setMonth(now.getMonth() - 1);
            break;
          case "last_3_months":
            startDate.setMonth(now.getMonth() - 3);
            break;
          case "last_6_months":
            startDate.setMonth(now.getMonth() - 6);
            break;
          case "this_year":
            startDate = new Date(currentYear, 0, 1);
            break;
          default:
            startDate = new Date(currentYear, 0, 1);
            break;
        }

        return { startDate, endDate };
      };

      const { startDate, endDate } = getDateRange(period);

      if (period === "all" || period === "this_year") {
        categories = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        data = await Promise.all(
          categories.map(async (_, monthIndex) => {
            const startOfMonth = new Date(currentYear, monthIndex, 1);
            const endOfMonth = new Date(
              currentYear,
              monthIndex + 1,
              0,
              23,
              59,
              59,
            );

            const revenueData = await db.bookings.findAll({
              where: {
                status: "2",
                createdAt: {
                  [Op.between]: [startOfMonth, endOfMonth],
                },
              },
              attributes: [
                [
                  db.sequelize.fn("SUM", db.sequelize.col("price")),
                  "total_revenue",
                ],
              ],
              raw: true,
            });

            const totalRevenue = revenueData[0]?.total_revenue || 0;
            return parseFloat(totalRevenue) || 0;
          }),
        );
      } else if (period === "last_3_months" || period === "last_6_months") {
        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        const monthsToShow = period === "last_3_months" ? 3 : 6;

        const now = new Date();

        for (let i = monthsToShow - 1; i >= 0; i--) {
          const monthDate = new Date(now);
          monthDate.setMonth(now.getMonth() - i);

          const monthIndex = monthDate.getMonth();
          const monthName = monthNames[monthIndex];
          const year = monthDate.getFullYear();

          categories.push(`${monthName} ${year}`);

          const startOfMonth = new Date(year, monthIndex, 1);
          const endOfMonth = new Date(year, monthIndex + 1, 0, 23, 59, 59);

          const revenueData = await db.bookings.findAll({
            where: {
              status: "2",
              createdAt: {
                [Op.between]: [startOfMonth, endOfMonth],
              },
            },
            attributes: [
              [
                db.sequelize.fn("SUM", db.sequelize.col("price")),
                "total_revenue",
              ],
            ],
            raw: true,
          });

          const totalRevenue = revenueData[0]?.total_revenue || 0;
          data.push(parseFloat(totalRevenue) || 0);
        }
      } else {
        const daysDiff = Math.ceil(
          (endDate - startDate) / (1000 * 60 * 60 * 24),
        );

        if (period === "last_week") {
          const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

          for (let i = 0; i < 7; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);

            const dayStart = new Date(currentDate);
            dayStart.setHours(0, 0, 0, 0);

            const dayEnd = new Date(currentDate);
            dayEnd.setHours(23, 59, 59, 999);
            const dayName = daysOfWeek[currentDate.getDay()];
            const dayNumber = currentDate.getDate();
            categories.push(`${dayName} ${dayNumber}`);

            const revenueData = await db.bookings.findAll({
              where: {
                status: "2",
                createdAt: {
                  [Op.between]: [dayStart, dayEnd],
                },
              },
              attributes: [
                [
                  db.sequelize.fn("SUM", db.sequelize.col("price")),
                  "total_revenue",
                ],
              ],
              raw: true,
            });

            const totalRevenue = revenueData[0]?.total_revenue || 0;
            data.push(parseFloat(totalRevenue) || 0);
          }
        } else if (daysDiff <= 31) {
          for (let i = 0; i < daysDiff; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);

            const dayStart = new Date(currentDate);
            dayStart.setHours(0, 0, 0, 0);

            const dayEnd = new Date(currentDate);
            dayEnd.setHours(23, 59, 59, 999);

            const day = currentDate.getDate();
            const month = currentDate.getMonth() + 1;
            categories.push(`${day}/${month}`);

            const revenueData = await db.bookings.findAll({
              where: {
                status: "2",
                createdAt: {
                  [Op.between]: [dayStart, dayEnd],
                },
              },
              attributes: [
                [
                  db.sequelize.fn("SUM", db.sequelize.col("price")),
                  "total_revenue",
                ],
              ],
              raw: true,
            });

            const totalRevenue = revenueData[0]?.total_revenue || 0;
            data.push(parseFloat(totalRevenue) || 0);
          }
        } else {
          const weeks = Math.ceil(daysDiff / 7);

          for (let i = 0; i < weeks; i++) {
            const weekStart = new Date(startDate);
            weekStart.setDate(startDate.getDate() + i * 7);

            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            weekEnd.setHours(23, 59, 59, 999);

            const startMonth = weekStart.getMonth() + 1;
            const startDay = weekStart.getDate();
            const endDay = weekEnd.getDate();
            categories.push(`Week ${i + 1} (${startDay}-${endDay})`);

            const revenueData = await db.bookings.findAll({
              where: {
                status: "2",
                createdAt: {
                  [Op.between]: [weekStart, weekEnd],
                },
              },
              attributes: [
                [
                  db.sequelize.fn("SUM", db.sequelize.col("price")),
                  "total_revenue",
                ],
              ],
              raw: true,
            });

            const totalRevenue = revenueData[0]?.total_revenue || 0;
            data.push(parseFloat(totalRevenue) || 0);
          }
        }
      }

      res.json({
        data,
        categories,
      });
    } catch (error) {
      return helper.failed(res, "Error fetching chart data", error);
    }
  },
};
