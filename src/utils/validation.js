const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("password is not valid ");
  }
};

const ValidateProfileEditData = (req) => {
  const ALLOWED_Fields = [ "age", "about", "skills", "gender"]

  const isAllowed = Object.keys(req.body).every((field) => ALLOWED_Fields.includes(field))

  return isAllowed;


}

module.exports = {
    validateSignupData,
    ValidateProfileEditData
}