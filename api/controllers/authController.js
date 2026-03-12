// backend/controllers/authController.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    // Destructure matching the database columns
    const { u_name, u_email, u_pass_word } = req.body;

    try {
        // 1. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(u_pass_word, salt);

        // 2. Insert into database using exact column names
        const query = `
            INSERT INTO users (u_name, u_email, u_pass_word, u_role) 
            VALUES ($1, $2, $3, $4) 
            RETURNING u_id
        `;

        const values = [u_name, u_email, hashedPassword, 'customer'];

        const result = await db.query(query, values);

        // 3. Send success response
        res.status(201).json({
            message: 'User registered successfully',
            u_id: result.rows[0].u_id
        });

    } catch (error) {
        console.error("Registration Error Details:", {
            message: error.message,
            code: error.code,
            detail: error.detail,
            stack: error.stack
        });

        // Handle duplicate email error
        if (error.code === '23505') {
            return res.status(400).json({ message: 'Email already exists.' });
        }

        res.status(500).json({ message: 'Server error. Please try again.' });
    }
};

exports.login = async (req, res) => {
    // Expecting u_email and u_pass_word from frontend
    const { u_email, u_pass_word } = req.body;

    try {
        // 1. Find user by email
        const query = 'SELECT * FROM users WHERE u_email = $1';
        const result = await db.query(query, [u_email]);

        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const user = result.rows[0];

        // 2. Compare password
        const isMatch = await bcrypt.compare(u_pass_word, user.u_pass_word);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // 3. Success - Return user details
        res.status(200).json({
            message: 'Login successful',
            user: {
                u_id: user.u_id,
                u_name: user.u_name,
                u_email: user.u_email,
                u_role: user.u_role
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
};