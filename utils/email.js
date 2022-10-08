// with gmail
const nodeMailer = require('nodemailer');
const { google } = require('googleapis');

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
);

oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

module.exports.sendMailWithGmail = async (data) => {
  const accessToken = await oAuth2Client.getAccessToken();
  let transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.SENDER_MAIL,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: accessToken,
    },
  });

  const mailData = {
    from: process.env.SENDER_MAIL,
    to: data.to,
    subject: data.subject,
    text: data.text,
    // html: `<b>Using html </b>`, // we can send email using html
  };
  let info = await transporter.sendMail(mailData);

  console.log('Message sent: %s', info.messageId);

  console.log('Preview URL: %s', nodeMailer.getTestMessageUrl(info));

  return info.messageId;
};

//with mailgun
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);

const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY,
});

module.exports.sendMailWithMailGun = async (data) => {
  const result = await mg.messages.create(
    'sandboxb133477ac4a84529a56c1668a90ffde6.mailgun.org',
    {
      from: 'Mailgun Sandbox <postmaster@sandboxb133477ac4a84529a56c1668a90ffde6.mailgun.org>',
      to: data.to,
      subject: data.subject,
      text: data.text,
    }
  );
  return result.id;
};
