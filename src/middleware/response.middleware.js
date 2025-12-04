export const responseMiddleware = (req, res, next) => {
  res.success = (message, data = null, statusCode = 200) => {
    return res.status(statusCode).json({ status: true, message, data });
  };

  res.error = (message, statusCode = 500) => {
    return res.status(statusCode).json({ status: false, message });
  };

  res.created = (message, data = null) => {
    return res.status(201).json({ status: true, message, data });
  };

  res.updated = (message, data = null) => {
    return res.status(200).json({ status: true, message, data });
  };

  res.deleted = (message, data = null) => {
    return res.status(200).json({ status: true, message, data });
  };

  next();
};
