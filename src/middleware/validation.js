import joi from "joi";
export const generalFields = {
  email: joi
    .string()
    .email({ tlds: { /*deny: ['com']*/ allow: ["com"] } })
    .required(),
  password: joi
    .string()
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
    .required(),
};

export const validationCoreFunction = (schema) => {
  return (req, res, next) => {
    const reqMethods = ["body", "params", "query", "headers", "file", "files"];
    let validationErrArr = [];
    for (const key of reqMethods) {
      if (schema[key]) {
        const validationResult = schema[key].validate(req[key], {
          abortEarly: false,
        });
        if (validationResult.error) {
          validationErrArr.push(validationResult.error.details);
        }
      }
    }

    if (validationErrArr.length) {
      // return next(
      //   new Error(
      //     "Validation Error",
      //     // `${validationErrArr.map((err) => err.message)}`,
      //     { cause: 400 }
      //   )
      // );
      return res
        .status(400)
        .json({ errMsg: "Validation Error", Errors: validationErrArr });
    }

    next();
  };
};
