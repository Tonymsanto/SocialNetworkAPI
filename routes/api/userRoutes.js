const router = require('express').Router();
const {
    addFriend,
    deleteFriend,
    getUsers,
    getSingleUser,
    createUser,
    updateUser,
    deleteUser,
} = require('../../controllers/userControllers.js');

router.route('/').get(getUsers).post(createUser);

router
    .route("/:userId/friends/:friendId")
    .post(addFriend)
    .delete(deleteFriend);
    
router
    .route('/:userId')
    .get(getSingleUser)
    .put(updateUser)
    .delete(deleteUser);

module.exports = router;