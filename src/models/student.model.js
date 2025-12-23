const db = require("../config/db");

class Student {
  static async findAll() {
    const [rows] = await db.query("SELECT * FROM students");
    return rows;
  }

  static async create({ name, email }) {
    const [result] = await db.query(
      "INSERT INTO students (name, email) VALUES (?, ?)",
      [name, email]
    );
    return { id: result.insertId, name, email, status: 'created', code: 201 };
  }
}

module.exports = Student;
