export const validation = (Shema) => {
  return (req, res, next) => {
    const vaildationRuselt = Shema.validate(
      {
        ...req.body,
        ...req.params,
        ...req.query,
      },
      { abortEarly: false }
    );
    if (vaildationRuselt.error) {
      return res.json({
        message: "Validation error",
        ValidationErr: vaildationRuselt.error.details,
      });
    }
    return next();
  };
};
