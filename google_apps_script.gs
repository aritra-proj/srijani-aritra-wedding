/**
 * Google Apps Script for Srijani & Aritra Wedding Ceremony Guestbook & RSVP
 *
 * HOW TO DEPLOY:
 * 1. Open your Google Sheet (you can use your existing one or a new sheet for the wedding):
 *    https://docs.google.com/spreadsheets/d/1Jzs9SV5XFWbnGXpV6LHq1ZG5Gn7fqzW-6LgiY1kArco/edit
 * 2. In the top menu, click: Extensions > Apps Script
 * 3. Paste this code.
 * 4. Click Save (💾).
 * 5. Click "Deploy" > "New deployment" > Select type "Web app".
 * 6. Set:
 *    - Description: "Srijani Wedding Guestbook API"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone" (Required so all guests can post without login)
 * 7. Deploy & copy the Web app URL.
 * 8. Paste it into app.js in WEDDING_CONFIG.googleAppsScriptUrl.
 */

const SHEET_ID = "1Jzs9SV5XFWbnGXpV6LHq1ZG5Gn7fqzW-6LgiY1kArco";
const SHEET_NAME = "Srijani_Wedding_Blessings";

function getSpreadsheet() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    const headers = ["Timestamp", "Guest Name", "RSVP Status", "Sticker", "Blessing Message", "Device Type", "IP Address", "User Agent"];
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#FBEAEB").setFontColor("#7A0C16");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function doGet(e) {
  try {
    const action = e && e.parameter ? e.parameter.action : "";
    if (action === "add" && e.parameter.name) {
      return handleAddBlessing({
        name: e.parameter.name || "Anonymous",
        status: e.parameter.status || "Joyfully Attending",
        sticker: e.parameter.sticker || "🌸",
        message: e.parameter.message || "",
        device: e.parameter.device || "Unknown",
        ip: e.parameter.ip || "Unknown",
        userAgent: e.parameter.userAgent || ""
      });
    }

    const sheet = getSpreadsheet();
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return createJsonResponse({ status: "success", blessings: [] });
    }

    const blessings = [];
    for (let i = data.length - 1; i >= 1; i--) {
      const row = data[i];
      if (row[1] && row[4]) {
        blessings.push({
          timestamp: formatDisplayDate(row[0]),
          name: String(row[1]),
          status: String(row[2] || "Joyfully Attending"),
          sticker: String(row[3] || "🌸"),
          message: String(row[4] || ""),
          device: String(row[5] || ""),
          ip: String(row[6] || "")
        });
      }
    }

    return createJsonResponse({ status: "success", count: blessings.length, blessings: blessings });
  } catch (error) {
    return createJsonResponse({ status: "error", message: error.toString() });
  }
}

function doPost(e) {
  try {
    let payload = {};
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (err) {
        payload = e.parameter || {};
      }
    } else {
      payload = e.parameter || {};
    }

    return handleAddBlessing(payload);
  } catch (error) {
    return createJsonResponse({ status: "error", message: error.toString() });
  }
}

function handleAddBlessing(data) {
  const sheet = getSpreadsheet();
  const timestamp = Utilities.formatDate(new Date(), "Asia/Kolkata", "yyyy-MM-dd HH:mm:ss");

  const row = [
    timestamp,
    data.name || "Anonymous Guest",
    data.status || "Joyfully Attending",
    data.sticker || "🌸",
    data.message || "",
    data.device || "Unknown",
    data.ip || "",
    data.userAgent || ""
  ];

  sheet.appendRow(row);
  return createJsonResponse({ status: "success", message: "Blessing recorded successfully!" });
}

function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function formatDisplayDate(val) {
  if (!val) return "Recently";
  try {
    const d = new Date(val);
    return Utilities.formatDate(d, "Asia/Kolkata", "dd MMM yyyy, hh:mm a");
  } catch (e) {
    return String(val);
  }
}
