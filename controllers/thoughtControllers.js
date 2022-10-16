const { Thought, User } = require('../models');
const { ObjectId } = require('mongoose').Types;

module.exports = {
    getThoughts(req, res) {
        Thought.find()
            .then((thoughts) => res.json(thoughts))
            .catch((error) => res.status(500).json(error));
    },

    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
            .select('-__v')
            .then((thought) =>
                !thought ?
                res.status(404).json({ message: 'Thought with that ID is not found.' }) :
                res.json(thought)
            )
            .catch((error) => res.status(500).json(error));
    },

    createThought(req, res) {
        Thought.create(req.body)
            .then((thought) => {
                return User.findOneAndUpdate({ _id: req.body.userId }, { $push: { thoughts: thought._id } }, { new: true })
            })
            .then(user => res.json(user))
            .catch((error) => res.status(500).json(error));
    },

    addReaction(req, res) {
        Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $addToSet: { reactions: req.body } }, { runValidators: true, new: true })
            .then((thought) =>
                !thought ?
                res.status(404).json({ message: 'Thought with that ID is not found.' }) :
                res.json(thought)
            )
            .catch((error) => res.status(500).json(error));
    },

    updateThought(req, res) {
        Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $set: req.body }, { runValidators: true, new: true })
            .then((thought) =>
                !thought ?
                res.status(404).json({ message: 'Thought with that ID is not found.' }) :
                res.json(thought)
            )
            .catch((error) => res.status(500).json(error));
    },

    deleteThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.thoughtId })
            .then((deletedThought) => {
                if (!deletedThought) {
                    res.status(404).json({ message: 'Thought with that ID is not found.' });
                }
                User.findOneAndUpdate({ thoughts: req.params.thoughtId }, { $pull: { thoughts: req.params.thoughtId } }, { new: true });
            })
            .then(() => res.json({ message: "thought deleted!" }))
            .catch((error) => res.status(500).json(error));
    },

    deleteReaction(req, res) {
        Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $pull: { reactions: { reactionId: req.params.reactionId } } }, { runValidators: true, new: true })
            .then((thought) =>
                !thought ?
                res.status(404).json({ message: 'Thought with that ID is not found.' }) :
                res.json(thought)
            )
            .catch((error) => res.status(500).json(error));
    },
}