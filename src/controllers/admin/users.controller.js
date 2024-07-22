const mongoose = require('mongoose');
const User = require('../../models/User');
const Response = require('../../models/Response'); // Modelo de Respuesta
const Suggestion = require('../../models/Suggestion'); // Modelo de Sugerencia

const adminUserCtrl = {};

// Renderiza la lista de usuarios con paginación
adminUserCtrl.renderUsers = async (req, res) => {
    const { page = 1, search = '' } = req.query;
    const limit = 4;
    const skip = (page - 1) * limit;
    const query = {
        ... (search ? { username: { $regex: search, $options: 'i' } } : {}),
        status: { $ne: 0 } // Solo usuarios activos (status !== 0)
    };

    try {
        const users = await User.find(query).limit(limit).skip(skip).lean();
        const count = await User.countDocuments(query);
        const hasNextPage = (page * limit) < count;
        const hasPrevPage = page > 1;

        res.render('admin/users/index', {
            users,
            currentPage: Number(page),
            hasNextPage,
            hasPrevPage,
            nextPage: Number(page) + 1,
            prevPage: Number(page) - 1,
            search,
            csrfToken: req.csrfToken()
        });
    } catch (error) {
        res.status(500).send(`Error al obtener usuarios: ${error.message}`);
    }
};

// Renderiza el formulario de creación de usuario
adminUserCtrl.renderUserForm = (req, res) => {
    res.render('admin/users/create', {
        csrfToken: req.csrfToken()
    });
};

// Función para validar los datos del formulario
function validateUserData(username, email, password, vali_password) {
    const errors = [];

    if (!username || !email || !password || !vali_password) {
        errors.push({ text: 'Todos los campos son obligatorios' });
    }
    if (password !== vali_password) {
        errors.push({ text: 'Las contraseñas no coinciden' });
    }
    if (password.length < 4) {
        errors.push({ text: 'La contraseña debe tener al menos 4 caracteres' });
    }

    return errors;
}

// Controlador para crear un nuevo usuario desde el administrador
adminUserCtrl.createNewUser = async (req, res) => {
    const { username, email, password, vali_password } = req.body;

    // Validar los datos del formulario
    const errors = validateUserData(username, email, password, vali_password);

    if (errors.length > 0) {
        return res.render('admin/users/create', {
            errors,
            csrfToken: req.csrfToken(),
            username,
            email
        });
    }

    try {
        // Verificar si el correo electrónico ya está en uso
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            req.flash('error_msg', 'El correo electrónico ya está en uso');
            return res.redirect('/admin/users/create');
        }

        // Crear una nueva instancia del modelo User
        const newUser = new User({ username, email });

        // Encriptar la contraseña
        newUser.password = await newUser.encryptPassword(password);

        // Guardar el nuevo usuario en la base de datos
        await newUser.save();

        req.flash('success', 'Usuario registrado correctamente.');
        res.redirect('/admin/users/index');
    } catch (error) {
        req.flash('error_msg', `Error al crear usuario: ${error.message}`);
        res.redirect('/admin/users/create');
    }
};

// Renderiza el formulario de edición de usuario
adminUserCtrl.renderEditUserForm = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).lean();
        if (!user) return res.status(404).send('Usuario no encontrado');
        
        res.render('admin/users/edit', {
            user,
            csrfToken: req.csrfToken()
        });
    } catch (error) {
        res.status(500).send(`Error al obtener el usuario: ${error.message}`);
    }
};

// Actualiza un usuario existente
adminUserCtrl.editUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { username, email, password } = req.body;

        // Busca el usuario por su ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }

        // Verifica si el correo electrónico está en uso por otro usuario
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                req.flash('error_msg', 'El correo electrónico ya está en uso');
                return res.redirect(`/admin/users/edit/${userId}`);
            }
            user.email = email;
        }

        // Actualiza los campos del usuario si se proporcionaron nuevos valores
        if (username) {
            user.username = username;
        }

        // Si se proporcionó un nuevo password, encripta y actualiza
        if (password) {
            user.password = await user.encryptPassword(password);
        }

        // Guarda los cambios en la base de datos
        await user.save();

        // Redirecciona después de guardar
        req.flash('success', 'Usuario actualizado correctamente');
        res.redirect('/admin/users/index');
    } catch (error) {
        res.status(500).send(`Error al actualizar el usuario: ${error.message}`);
    }
};



// Renderiza la alerta de eliminación lógica de usuario
adminUserCtrl.renderRemoveUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).lean();
        if (!user) return res.status(404).send('Usuario no encontrado');

        res.render('admin/users/alert', {
            user,
            csrfToken: req.csrfToken()
        });
    } catch (error) {
        res.status(500).send(`Error al obtener el usuario: ${error.message}`);
    }
};

// Elimina un usuario (cambio de estado)
adminUserCtrl.createResponse = async (req, res) => {
    try {
        const userId = mongoose.Types.ObjectId(req.body.userId);
        const response = new Response({
            totalScore: req.body.totalScore,
            timeTaken: req.body.timeTaken,
            precision: req.body.precision,
            comprehension: req.body.comprehension,
            feedback: req.body.feedback,
            user: userId,
            attempts: req.body.attempts,
            status: req.body.status
        });
        await response.save();
        res.json({ message: 'Response created successfully' });
    } catch (error) {
        console.error('Error creating response:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Función para crear un Suggestion
adminUserCtrl.createSuggestion = async (req, res) => {
    try {
        const userId = mongoose.Types.ObjectId(req.body.userId);
        const suggestion = new Suggestion({
            user: userId,
            suggestions: req.body.suggestions,
            status: req.body.status
        });
        await suggestion.save();
        res.json({ message: 'Suggestion created successfully' });
    } catch (error) {
        console.error('Error creating suggestion:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

adminUserCtrl.removeUser = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.params.id);
        const adminId = req.user._id;

        console.log(`Updating status for user: ${userId}`);
        
        // Actualizar el estado y el campo deletedBy del usuario
        const userUpdateResult = await User.findByIdAndUpdate(userId, { status: 0, deletedBy: adminId });
        console.log('User update result:', userUpdateResult);

        const responseUpdateResult = await Response.updateMany({ user: userId }, { $set: { status: 0 } });
        console.log('Response update result:', responseUpdateResult);

        const suggestionUpdateResult = await Suggestion.updateMany({ user: userId }, { $set: { status: 0 } });
        console.log('Suggestion update result:', suggestionUpdateResult);

        req.flash('success', 'Usuario eliminado correctamente');
        res.redirect('/admin/users/index');
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};



module.exports = adminUserCtrl;
