const { User, Thought } = require("../models");

module.exports = {
  // get all users
  async getUsers(req, res) {
    try {
      const users = await User.find();

      res.json(users);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  },
  // get a single user
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne(
        { _id: req.params.userId }).select("-_v");

      if (!user) {
        return res.status(404).json({ message: "No user with that ID" });
      }

      res.json(user);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  },
  //   create a new user
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  //   update a user
  async updateUser(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!user) {
        res.status(404).json({ message: "No user with this id" });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //   delete a user
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.userId });

      if (!user) {
        res.status(404).json({ message: "No user with this id" });
      }

      await User.deleteMany({ _id: { $in: user.thoughts } });
      res.json({ message: "User and thoughts deleted!" });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // add a friend to a users friend list
  async addFriend(req, res) {
    console.log(req.params);
    console.log(req.body);
    try {
      // const friend = await User.findOne({ _id: req.body.friendId })

      // if(!friend) {
      //   return res.status(404).json({ message: 'no friend found with this Id', })
      // }

      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.body.friendId } },
        { runValidators: true, new: true }
      )

      if(!user) {
        return res.status(404).json({ message: 'no user found with this Id', })
      }

      res.json("Friend added!");
    } catch (errr) {
      res.status(500).json(err);
    }
  }
};
