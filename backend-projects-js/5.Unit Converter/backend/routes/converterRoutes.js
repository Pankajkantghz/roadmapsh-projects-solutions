import express
from "express";

import {
  convertUnit,
} from "../controllers/converterController.js";

import {
  validateConvert,
} from "../middleware/validateConvert.js";

const router =
  express.Router();

router.post(
  "/convert",
  validateConvert, // middleware
  convertUnit
);

export default router;