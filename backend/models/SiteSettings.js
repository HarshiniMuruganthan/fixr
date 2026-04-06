const mongoose = require("mongoose");

const siteSettingsSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      default: "Fixr",
    },
    siteEmail: {
      type: String,
      default: "support@fixr.com",
    },
    sitePhone: {
      type: String,
      default: "+1 (555) 000-0000",
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    allowNewUsers: {
      type: Boolean,
      default: true,
    },
    categories: [
      {
        name: String,
        icon: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("SiteSettings", siteSettingsSchema);
