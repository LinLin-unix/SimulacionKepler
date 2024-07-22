const express = require('express');
const router = express.Router();
const {
    renderUserForm,
    createNewUser,
    renderEditUserForm,
    renderUsers,
    removeUser,
    renderRemoveUser,
    editUser
} = require('../../controllers/admin/users.controller');

const {isLoggedIn} = require('../../lib/auth');

router.get('/admin/users/create', isLoggedIn, renderUserForm);
router.post('/admin/users/create', isLoggedIn, createNewUser);

router.get('/admin/users/edit/:id', isLoggedIn, renderEditUserForm);
router.put('/admin/users/edit/:id', isLoggedIn, editUser);

router.get('/admin/users/index', isLoggedIn, renderUsers);

router.get('/admin/users/remove/:id', isLoggedIn, renderRemoveUser);
router.post('/admin/users/remove/:id', isLoggedIn, removeUser);

module.exports = router;
