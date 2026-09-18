const express = require("express");

const router = express.Router();

const {
    registrationController,
    loginController,
    verifyEmailController,
    forgetPasswordController
} = require("../controllers/authControllers");

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication APIs
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - password
 *               - confirmPassword
 *               - terms
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Liton Mia
 *               email:
 *                 type: string
 *                 format: email
 *                 example: liton@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password@123
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 example: Password@123
 *               terms:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Registration successful
 *       400:
 *         description: Validation error or user already exists
 *       500:
 *         description: Internal Server Error
 */
router.post("/register", registrationController);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: liton@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password@123
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.post("/login", loginController);

/**
 * @swagger
 * /api/auth/verify/{token}:
 *   post:
 *     summary: Verify user email
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Email verification token
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired verification token
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.post("/verify/:token", verifyEmailController);

/**
 * @swagger
 * /api/auth/forget-password:
 *   post:
 *     summary: Send password reset email
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: liton@example.com
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *       400:
 *         description: Invalid email
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.post("/forget-password", forgetPasswordController);

module.exports = router;