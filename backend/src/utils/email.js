import nodemailer from 'nodemailer';
import config from '../config/index.js';

const transporter = nodemailer.createTransport({
  service: config.email.service,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

export const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: config.email.from,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error(`❌ Email sending failed: ${error.message}`);
  }
};

export const sendOrderConfirmationEmail = (customer, order) => {
  const html = `
    <h2>Order Confirmation</h2>
    <p>Hi ${customer.name},</p>
    <p>Thank you for your order!</p>
    <h3>Order Details:</h3>
    <p><strong>Order Number:</strong> ${order.orderNumber}</p>
    <p><strong>Total Amount:</strong> $${order.total}</p>
    <p><strong>Status:</strong> ${order.status}</p>
    <p>We will notify you when your order is shipped.</p>
  `;

  sendEmail(customer.email, 'Order Confirmation', html);
};

export const sendWelcomeEmail = (user) => {
  const html = `
    <h2>Welcome to E-Commerce SaaS!</h2>
    <p>Hi ${user.name},</p>
    <p>Welcome to our platform. Your account has been created successfully.</p>
    <p>Start exploring and enjoy our services!</p>
  `;

  sendEmail(user.email, 'Welcome to E-Commerce SaaS', html);
};
