const { validate, version } = require("uuid");

function isValidUUID(uuid) {
   return validate(uuid) && version(uuid) === 4;
}

function isValidDate(dateStr) {
   if (typeof dateStr !== "string") return false;

   const regex = /^\d{4}[-]\d{2}[-]\d{2}$/;
   if (!regex.test(dateStr)) return false;
   
   const normalized = dateStr.replace(/[\/]/g, "-");
   const date = new Date(normalized);
 
   return !isNaN(date.getTime());
}

function isFutureDate(dateStr) {
   const date = new Date(dateStr);
   const now = new Date();
   return date > now;
}

module.exports = {
   isValidUUID,
   isValidDate,
   isFutureDate,
};
