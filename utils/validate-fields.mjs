import validator from "validator";

let _validate_name = (name) => {
  return new Promise((resolve, reject) => {
    name = name.split(" ").join(""); //Removing blanks
    let is_valid = validator.isAlphanumeric(name);
    if (is_valid) {
      resolve("The name is valid.");
    } else {
      reject("The name is invalid.");
    }
  });
};

let _validate_email = (email) => {
  return new Promise((resolve, reject) => {
    let is_valid = validator.isEmail(email);
    if (is_valid) {
      resolve("The email is valid.");
    } else {
      reject("The email is invalid.");
    }
  });
};

let _validate_phone = (phone) => {
  return new Promise((resolve, reject) => {
    let is_valid = validator.isMobilePhone(phone);
    if (is_valid) {
      resolve("The phone is valid.");
    } else {
      reject("The phone is invalid.");
    }
  });
};

export function validate_alphanumeric(val) {
  return new Promise((resolve, reject) => {
    val = val.split(" ").join("");
    let is_valid = validator.isAlphanumeric(val);

    if (is_valid) {
      resolve(true);
    } else {
      resolve(false);
    }
  });
}

export function validate_email(email) {
  return new Promise((resolve, reject) => {
    let is_valid = validator.isEmail(email);
    if (is_valid) {
      resolve(true); // Return true if valid
    } else {
      resolve(false); // Return false if invalid
    }
  });
}

export function validate_phone(phone) {
  return new Promise((resolve, reject) => {
    let is_valid = validator.isMobilePhone(phone);
    if (is_valid) {
      resolve(true); // Return true if valid
    } else {
      resolve(false); // Return false if invalid
    }
  });
}

export function validate_fields(name1, name2, email, phone) {
  return Promise.all([
    _validate_name(name1),
    _validate_name(name2),
    _validate_email(email),
    _validate_phone(phone),
  ])
    .then((values) => {
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
}
