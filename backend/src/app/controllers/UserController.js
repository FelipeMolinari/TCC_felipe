const User = require("../models/User");
const userStoreValidation = require("../validation/userStore");
const userUpdateValidation = require("../validation/userUpdate");

class UserController {
  async index(req, res) {
    const users = await User.findAll();
    return res.json(users);
  }

  async store(req, res) {
    const { firstName, lastName, email, password } = req.body;
    try {
      if (!(await userStoreValidation(req.body))) {
        return res.status(400).json({ error: "Validation fails" });
      }

      const userExist = await User.findOne({ where: { email } });

      if (userExist) {
        return res.status(400).json({ error: "User already exist!" });
      }

      await User.create({
        firstName,
        lastName,
        email,
        password,
      });
      return res.status(200).json({ message: "User successfully created" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      if (!(await userUpdateValidation(req.body))) {
        return res.status(401).json({ error: "Validation fails" });
      }
      const { oldpassword } = req.body;

      const user = await User.findByPk(req.user.id);

      if (oldpassword && !(await user.checkPassword(oldpassword))) {
        return res.status(401).json({ error: "Password does not match" });
      }
      const newUser = await user.update(req.body);
      return res.json({
        newUser,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new UserController();