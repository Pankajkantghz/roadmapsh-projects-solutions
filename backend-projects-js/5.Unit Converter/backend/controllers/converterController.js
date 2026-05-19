import {
  convertService,
} from "../services/conversionService.js";

export const convertUnit =
(req, res) => {

  try {

    const result =
      convertService(
        req.body
      );

    res.json({
      result,
    });

  } catch (error) {

    res.status(400)
      .json({
        msg:
          error.message,
      });
  }
};