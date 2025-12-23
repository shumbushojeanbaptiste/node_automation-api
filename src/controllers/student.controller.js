const Student = require("../models/student.model");
const getRedisClient = require("../config/redis");

exports.getStudents = async (req, res) => {
  const redis = await getRedisClient();

  const cached = await redis.get("students");
  if (cached) {
    return res.json(JSON.parse(cached));
  }

  const students = await Student.findAll();
  await redis.setEx("students", 60, JSON.stringify(students));

  res.json(students);
};

exports.createStudent = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Missing fields" });
    }

    await Student.create({ name, email });

    const redis = await getRedisClient();
    await redis.del("students");

    res.status(201).json({ status: "created" });
  } catch (err) {
    console.error("CREATE STUDENT ERROR:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
