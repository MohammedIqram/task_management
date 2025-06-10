// controller/user_controller.js
import crypto from "crypto"; // This might not be needed anymore for token generation
import jwt from "jsonwebtoken"; // Import jsonwebtoken
import { MESSAGES, RESPONSE_CODES } from '../utils/constant.js';
import { MODELS } from "../config/config.js";
import { ServerResponse } from "../utils/helper.js"; // Ensure ServerResponse is correctly defined
// Ensure your models are correctly initialized with Sequelize to have User methods.

// Define a JWT secret key (MAKE THIS AN ENVIRONMENT VARIABLE IN PRODUCTION!)
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key_change_this";

export const findAllUsers = async (req, res) => {
    MODELS.User.findAll({
        attributes: { exclude: ['password'] } // Exclude password from general user listing
    })
    .then(data => {
        console.log('data=',data)
        return ServerResponse(res, RESPONSE_CODES.SUCCESS, MESSAGES.USER_SEARCH_SUCCESS, data);
    })
    .catch(err => {
        console.log('err=',err)
        ServerResponse(res, RESPONSE_CODES.ERROR, err.message, err);
    });
};

export const addUser = async (req, res) => {
    console.log('body=',req.body)
    let body = req.body;
    // Password hashing is now handled by a Sequelize hook in the User model
    if (!body.username || !body.email || !body.password) {
      return ServerResponse(res, RESPONSE_CODES.MISSING_DATA, "Missing required fields: username, email, or password.");
    }

    MODELS.User.create(body)
    .then(data => {
        // Exclude password from the response
        const { password, ...userWithoutPassword } = data.toJSON();
        return ServerResponse(res, RESPONSE_CODES.SUCCESS, "User registered successfully", userWithoutPassword);
    })
    .catch(err => {
        // Handle unique constraint errors for email/username
        if (err.name === 'SequelizeUniqueConstraintError') {
            return ServerResponse(res, RESPONSE_CODES.CONFLICT, "User with this email or username already exists.", err.errors);
        }
        return ServerResponse(res, RESPONSE_CODES.ERROR, err.message, err);
    });
};

export const updateUser = async (req, res) => {
    console.log('body=',req.body)
    let body = req.body;
    if (!body.id) {
        return ServerResponse(res, RESPONSE_CODES.MISSING_DATA, "User id is missing");
    }

    // If password is being updated, it will be hashed by the hook
    MODELS.User.update(body, { where: { id: body.id } })
    .then(effectedRows => {
        if (effectedRows[0] > 0) {
            return ServerResponse(res, RESPONSE_CODES.SUCCESS, "Updated successfully");
        } else {
            return ServerResponse(res, RESPONSE_CODES.NOT_FOUND, "User not found ");
        }
    })
    .catch(err => {
        return ServerResponse(res, RESPONSE_CODES.ERROR, err.message, err);
    });
};

export const deleteUser = (req, res) => {
    console.log('local=',req.params);
    const id = req.params.id;
    if (!id) {
        return ServerResponse(res, RESPONSE_CODES.MISSING_DATA, "User id is missing");
    }
    console.log('id=',id);
    MODELS.User.destroy({ where: { id: id } })
        .then(effectedRows => {
            if (effectedRows > 0)
                ServerResponse(res, RESPONSE_CODES.SUCCESS, "Deleted successfully ");
            else
                ServerResponse(res, RESPONSE_CODES.NOT_FOUND, "User not found ");
        })
        .catch(err => {
            ServerResponse(res, RESPONSE_CODES.ERROR, err.message, err);
        });
};

export const changePassword = async (req, res) => {
    if (!req.body.password || !req.params.id) { // Use 'password' instead of 'PASSWORD' to match model field
        return ServerResponse(res, RESPONSE_CODES.MISSING_DATA, MESSAGES.USER_CHANGE_PASS_EMPTY_PASSWORD);
    }

    const id = req.params.id;
    // Password hashing for update is handled by the model hook.
    // Ensure you're only updating the password field, not recreating tokens here
    let updData = {
        password: req.body.password
    }

    MODELS.User.update(updData, {
        where: { id: id },
        individualHooks: true // Important: ensure hooks are run for update
    })
    .then(effectedRows => {
        if (effectedRows[0] === 0) { // Sequelize update returns an array [number of affected rows]
            return ServerResponse(res, RESPONSE_CODES.NOT_FOUND, MESSAGES.DATA_NOT_FOUND);
        }
        return ServerResponse(res, RESPONSE_CODES.SUCCESS, MESSAGES.DELETE_SUCCESS, { id: id }); // Return something meaningful
    })
    .catch(err => {
        ServerResponse(res, RESPONSE_CODES.ERROR, err.message, err);
    });
}

export const findUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await MODELS.User.findOne({
            where: { id: id },
            attributes: { exclude: ['password'] }, // Exclude sensitive attribute
        });

        if (!user) {
            return ServerResponse(res, RESPONSE_CODES.NOT_FOUND, MESSAGES.DATA_NOT_FOUND);
        }

        return ServerResponse(
            res,
            RESPONSE_CODES.SUCCESS,
            MESSAGES.SEARCH_SUCCESS,
            user
        );
    } catch (err) {
        return ServerResponse(res, RESPONSE_CODES.ERROR, err.message, err);
    }
}

// --- NEW LOGIN FUNCTION ---
export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return ServerResponse(res, RESPONSE_CODES.MISSING_DATA, "Email and password are required.");
    }

    try {
        const user = await MODELS.User.findOne({ where: { email: email } });

        if (!user) {
            return ServerResponse(res, RESPONSE_CODES.NOT_FOUND, "Invalid credentials.");
        }

        // Compare password (using the instance method defined in the model)
        const isMatch = await user.comparePassword(password);
        console.log('isMatch=',isMatch)
        if (!isMatch) {
            return ServerResponse(res, RESPONSE_CODES.UNAUTHORIZED, "Invalid credentials.");
        }

        // Generate JWT Token
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' }); 

        // Return token and basic user info (without password)
        const { password: userPassword, ...userWithoutPassword } = user.toJSON();

        return ServerResponse(res, RESPONSE_CODES.SUCCESS, "Login successful.", { token, user: userWithoutPassword });

    } catch (error) {
        console.error('Login error:', error);
        return ServerResponse(res, RESPONSE_CODES.ERROR, "An error occurred during login.", error);
    }
};