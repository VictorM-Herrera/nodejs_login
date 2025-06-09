const db = require("../config/mysql.config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../middlewares/sendMail");
const userController = {};

userController.getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM users");
    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Ocurrio un error al tratar de obtener los usuarios" });
  }
};

userController.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query("SELECT * FROM users WHERE user_id = ?", [id]); //esta es la forma correcta para que no haya inyeccion de codigo.
    if (rows[0]) {
      res.status(200).json({ user: rows[0] });
    } else {
      res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Ocurrio un error al tratar de obtener el usuario" });
  }
};

userController.createNewUser = async (req, res) => {
  try {
    const requiredFields = ["name", "last_name", "birthdate", "email", "password"];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Falta el campo: ${field}` });
      }
    }
    const password = await generatePassword(req.body.password);
    const [rows] = await db.query(
      "INSERT INTO users (`name`,last_name, phone, email, password, dni, nationality, address, genre, profile_picture, birthdate) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
      [
        req.body.name,
        req.body.last_name,
        req.body.phone,
        req.body.email,
        password,
        req.body.dni,
        req.body.nationality,
        req.body.address,
        req.body.genre,
        req.body.profile_picture,
        req.body.birthdate,
      ]
    );
    if (rows.affectedRows > 0) {
      console.log("Inserción exitosa");
      sendMail(req, res);
      
    } else {
      console.log("No se insertó ninguna fila");
    }
    res.status(201).json({ message: "Usuario creado con exito", userId: rows.insertId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Ocurrio un error al crear un nuevo usuario" });
  }
};

userController.logIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email y contraseña son obligatorios" });

    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (!rows[0]) {
      return res.status(401).json({ error: "El Email o la Contraseña ingresada no son correctos" });
    } else {
      const validPassword = await bcrypt.compare(password, rows[0].password);
      if (validPassword) {
        const accesToken = jwt.sign({ user_id: rows[0].user_id }, process.env.JWT_SECRET, {
          expiresIn: "1h",
          algorithm: "HS256",
        });
        const { password: _, ...user } = rows[0];
        res.status(200).send({ user, token: accesToken });
        /**const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
        ); */
      } else {
        return res.status(401).json({ error: "El Email o la Contraseña ingresada no son correctos" });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

userController.updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const useridFromToken = req.decoded.user_id;

    if (parseInt(id) !== useridFromToken) {
      return res.status(403).json({ error: "No tienes permiso para modificar este usuario" });
    }

    if (!Object.keys(req.body).length) {
      return res.status(400).json({ error: "No se enviaron campos para actualizar" });
    }

    const fields = Object.keys(req.body)
      .map((field) => `${field} = ?`)
      .join(", ");
    const values = Object.values(req.body);

    const [result] = await db.query(`UPDATE users SET ${fields} WHERE user_id = ?`, [...values, id]);
    if (result.affectedRows > 0) {
      const [userRows] = await db.query("SELECT * FROM users WHERE user_id = ?", [id]);
      res.status(200).json({ message: "Usuario Actualizado con exito", user: userRows[0] });
    } else {
      res.status(404).json({ error: "Usuario no encontrado o sin cambios" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

userController.removeUserById = (req, res) => {
  try {
    const { id } = req.params;
    const useridFromToken = req.decoded.user_id;

    if (parseInt(id) !== useridFromToken) {
      return res.status(403).json({ error: "No tienes permiso para borrar este usuario" });
    }
  } catch (error) {
    console.log(error);
    req.status(500).json({ error: "Error interno del servidor" });
  }
};

const generatePassword = async (pass) => {
  const hash = await bcrypt.hash(pass, 10);
  return hash;
};

module.exports = userController;
