const { ObjectId } = require('mongoose').Types;



const { Thought, User } = require('../models');

module.exports = {
    addFriend(req, res) {
        User.findOneAndUpdate({ _id: req.params.userId }, { $addToSet: { friends: req.params.friendId } }, { new: true, runValidators: true })
            .then((user) => {
                if (!user) {
                    res.status(404).json({ message: "User with this id not found." });
                    return;
                }
                res.json(user);
            })
            .catch((error) => res.json(error));
    },

    deleteFriend(req, res) {
        User.findOneAndUpdate({ _id: req.params.userId }, { $pull: { friends: req.params.friendId } }, { new: true })
            .then((user) => {
                if (!user) {
                    return res.status(404).json({ message: "User with this id not found." });
                }
                res.json(user);
            })
            .catch((error) => res.json(error));
    },
    
    getUsers(req, res) {
        User.find()
            .then((users) => res.json(users))
            .catch((error) => res.status(500).json(error));
    },

    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
            .select('-__v')
            .then((user) =>
                !user ?
                res.status(404).json({ message: 'User with this id not found.' }) :
                res.json(user)
            )
            .catch((error) => res.status(500).json(error));
    },

    createUser(req, res) {
        User.create(req.body)
            .then((user) => res.json(user))
            .catch((error) => {
                console.log(error);
                return res.status(500).json(error);
            });
    },

    updateUser(req, res) {
        User.findOneAndUpdate({ _id: req.params.userId }, { $set: req.body }, { runValidators: true, new: true })
            .then((user) =>
                !user ?
                res.status(404).json({ message: 'User with this id not found.' }) :
                res.json(user)
            )
            .catch((error) => res.status(500).json(error));
    },

    deleteUser(req, res) {
        User.findOneAndDelete({ _id: req.params.userId }).then((user) => !user ? res.status(404).json({ message: 'No user with that ID' }) : Thought.deleteMany({
            _id: {
                $in: user.thoughts
            }
        })).then(() => res.json({ message: 'User and associated thoughts have been deleted!' })).catch((error) => res.status(500).json(error));
    },


};