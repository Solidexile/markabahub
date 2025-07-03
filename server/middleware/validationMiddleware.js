const { validationResult } = require('express-validator');
const ErrorResponse = require('../utils/errorResponse');

exports.validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const errorMessages = errors.array().map(err => err.msg);
    return next(new ErrorResponse(errorMessages.join(', '), 400));
  };
};

// File upload validation
exports.validateFile = (fieldName, allowedTypes, maxSizeMB = 5) => {
  return (req, res, next) => {
    if (!req.file) {
      return next(new ErrorResponse(`Please upload a ${fieldName}`, 400));
    }

    const file = req.file;
    const fileType = file.mimetype.split('/')[0];
    const maxSize = maxSizeMB * 1024 * 1024;

    if (!allowedTypes.includes(fileType)) {
      return next(new ErrorResponse(
        `Invalid file type. Only ${allowedTypes.join(', ')} allowed`, 
        400
      ));
    }

    if (file.size > maxSize) {
      return next(new ErrorResponse(
        `File too large. Max size is ${maxSizeMB}MB`, 
        400
      ));
    }

    next();
  };
};