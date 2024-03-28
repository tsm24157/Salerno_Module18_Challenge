const { User } = require('../models');

const UserController = {
    async getUsers(req,res) {
        User.find({})
        .then(user => res.json(user))
        .catch(err => res.status(500).json(err));
    },
    async createUser(req,res) {
        try {
            const user = await User.create(req.body);
            res.json(user);
        } 
        catch (err) {
            res.status(500).json(err);
        }
    },
    async getUserById(req,res) {
        try {
            const user = await User.findOne({ _id: req.params.userId })
              .select('-__v');
      
            if (!user) {
              return res.status(404).json({ message: 'No user with that ID' })
            }
      
            res.json({user});
        } 
        catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },
    updateUser(req, res) {
        User.findOneAndUpdate(req.params.id, req.body, { new: true })
          .then(user => {
            if (!user) {
              return res.status(404).json({ message: 'User not found. Please check the id.' });
            }
            res.json(user);
          })
          .catch(err => res.status(500).json(err));
    },
    async deleteUser(req, res) {
        User.findOneAndDelete(req.params.id)
          .then(user => {
            if (!user) {
              return res.status(404).json({ message: 'User not found.' });
            }
            res.json({ message: 'User successfully deleted.' });
          }).catch(err =>res.status(500).json(err));
      },
      addFriend(req, res) {
        User.findOneAndUpdate(
          { _id: req.params.userId },
          { $addToSet: { friends: req.body.friendId || req.params.friendId} },
          { new: true }
        )
          .then(user => {
            if (!user) {
              return res.status(404).json({ message: 'User not found.' });
            }
            res.json(user);
          })
          .catch(err => res.status(500).json(err));
      },
      removeFriend({ params }, res) {
        User.findOneAndUpdate(
          { _id: params.userId },
          { $pull: { friends: params.friendId } },
          { new: true }
        )
          .then((dbuser) => {
            if (!dbuser) {
              return res.status(404).json({ message: "No user with this id." });
            }
            const removed = !dbuser.friends.includes(params.friendId);
            if (removed) {
              res.json({ message: "Friend removed successfully.", dbuser });
            } else {
              res.json(dbuser);
            }
          })
          .catch((err) => res.status(400).json(err));
      },
}
module.exports = UserController;