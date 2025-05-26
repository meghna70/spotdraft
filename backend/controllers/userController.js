const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const pool = require('../db');
const nodemailer = require('nodemailer');
const otpStore = new Map();

exports.signUp = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
        return res.status(400).json({ error: 'All fields are required' });

    try {
        const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);

        if (userExists.rows.length > 0)
            return res.status(409).json({ error: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const result = await db.query(
            `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email`,
            [name, email, hashedPassword]
        );

        const user = result.rows[0];


        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '6h' }
        );

        return res.status(201).json({ user, token });
    } catch (error) {
        console.error('Sign up error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.signIn = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ error: 'All fields are required' });

    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length === 0)
            return res.status(404).json({ error: 'User not found' });

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch)
            return res.status(401).json({ error: 'Invalid credentials' });


        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            token,
        });
    } catch (error) {
        console.error('Sign in error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
        console.log("email and password:", email, newPassword)
        return res.status(400).json({ message: 'Email and new password are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        const result = await pool.query(
            'UPDATE users SET password = $1 WHERE email = $2 RETURNING email',
            [hashedPassword, email]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error('Error resetting password:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.sendOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }


    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await db.query(
        'UPDATE users SET otp = $1, otp_expires_at = $2 WHERE email = $3',
        [otp, expiresAt, email]
    );
    otpStore.set(email, otp);
    console.log(`OTP for ${email}: ${otp}`);

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP is: ${otp}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'OTP sent to email' });
    } catch (err) {
        console.error('Email send error:', err);
        res.status(500).json({ message: 'Failed to send OTP' });
    }
};

const checkOtpForEmail = async (email, otp) => {
    const result = await db.query(
        'SELECT otp, otp_expires_at FROM users WHERE email = $1',
        [email]
    );

    if (result.rowCount === 0) return false;

    const user = result.rows[0];
    const now = new Date();

    return user.otp === otp && new Date(user.otp_expires_at) > now;
};


exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    const user = await db.query('SELECT otp, otp_expires_at FROM users WHERE email = $1', [email]);

    if (!user.rows.length || user.rows[0].otp !== otp || new Date(user.rows[0].otp_expires_at) < new Date()) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    try {
        const valid = await checkOtpForEmail(email, otp);

        if (!valid) return res.status(400).json({ message: 'Invalid or expired OTP' });
       
        await db.query('UPDATE users SET otp = NULL, otp_expires_at = NULL WHERE email = $1', [email]);
        return res.json({ message: 'OTP verified' });
    } catch (err) {
        return res.status(500).json({ message: 'Server error' });
    }
};
