const express = require("express");
const router = express.Router();
const controller = require("../controllers/student.controller");

router.get("/students", controller.getStudents);
router.post("/students", controller.createStudent);

module.exports = router;
