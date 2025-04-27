import nodemailer from "nodemailer";


export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for port 465, false for other ports
    auth: {
        user: "salascordero2003@gmail.com",
        pass: "gazl jpno facl iuqv",
    },
});

transporter.verify().then(() => {
    console.log("Ready to send emails");
});