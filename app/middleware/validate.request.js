
const deleteFile=require('../helper/deleteFile')

function validateRequest(schema) {

    return (req, res, next) => {
      const { error } = schema.validate(req.body);
      if (error) {
        if(req.file?.filename)
        deleteFile('uploads/profile',req.file.filename)
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
        });
      }
      next();
    };
  }
  
  module.exports = validateRequest;
  