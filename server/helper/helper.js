const path = require("path");
const uuid = require("uuid").v4;

module.exports = {
  success: function (res, message = "", body = {}) {
    return res.status(200).json({
      success: true,
      status: 200,
      message: message,
      body: body,
    });
  },
  failure: function (res, message = "", body = {}) {
    return res.status(404).json({
      success: false,
      status: 404,
      message: message,
      body: body,
    });
  },
  failed: function (res, message = "", body = {}) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: message,
      body: body,
    });
  },
  error: function (res, message = "", body = {}) {
    return res.status(401).json({
      success: false,
      status: 401,
      message: message,
      body: body,
    });
  },
  forbidden: function (res, message = "", body = {}) {
    return res.status(402).json({
      success: false,
      status: 402,
      message: message,
      body: body,
    });
  },
  notfound: function (res, message = "", body = {}) {
    return res.status(404).json({
      success: false,
      status: 404,
      message: message,
      body: body,
    });
  },
  fileUpload: async (file) => {
    if (!file) return null;

    try {
      const extension = path.extname(file.name);
      const filename = uuid() + extension;
      const uploadPath = path.join(process.cwd(), "public", "images", filename);

      await file.mv(uploadPath);

      return `/images/${filename}`;
    } catch (err) {
      throw err;
    }
  },
  checkValidation: async (v) => {
    var errorsResponse;
    const match = await v.check().then(function (matched) {
      if (!matched) {
        var valdErrors = v.errors;
        var respErrors = [];
        Object.keys(valdErrors).forEach(function (key) {
          if (valdErrors && valdErrors[key] && valdErrors[key].message) {
            respErrors.push(valdErrors[key].message);
          }
        });
        errorsResponse = respErrors.length > 0 ? respErrors[0] : "";
      }
    });
    return errorsResponse;
  },
  unixTimestamp: function () {
    var time = Date.now();
    var n = time / 1000;
    return (time = Math.floor(n));
  },
  fileUploadChat: async (file) => {
    if (!file) return null;

    try {
      let extension = path.extname(file.name).toLowerCase();
      if (!extension) {
        const mimeToExt = {
          "image/jpeg": ".jpg",
          "image/png": ".png",
          "image/gif": ".gif",
          "image/webp": ".webp",
          "application/pdf": ".pdf",
          "text/plain": ".txt",
          "application/msword": ".doc",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            ".docx",
          "text/csv": ".csv",
          "application/vnd.ms-excel": ".xls",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
            ".xlsx",
          "video/mp4": ".mp4",
          "video/quicktime": ".mov",
          "video/x-msvideo": ".avi",
          "audio/mpeg": ".mp3",
          "audio/wav": ".wav",
          "audio/ogg": ".ogg",
        };

        extension = mimeToExt[file.mimetype] || ".bin";
      }

      const filename = uuid() + extension;
      const uploadPath = path.join(process.cwd(), "public", "images", filename);

      await file.mv(uploadPath);

      return `/images/${filename}`;
    } catch (err) {
      console.error("File upload error:", err);
      throw err;
    }
  },
  getFileTypeName: async (messageType) => {
    const typeNames = {
      1: "message",
      2: "📷 Image",
      3: "📄 PDF",
      4: "📝 Document",
      5: "📊 CSV file",
      6: "📈 Excel file",
      7: "🎬 Video",
      8: "🎵 Audio",
    };
    return typeNames[messageType] || "📎 File";
  },
};
