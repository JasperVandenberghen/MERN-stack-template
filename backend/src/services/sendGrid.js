import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
let emailSentTimestamp = null;

export const sendEmail = async (to, subject, text, html = '') => {

  const now = Date.now();
  const interval = 60 * 5000;

  const payload = { to, subject, text, html };
  console.log('PAYLOAD:', payload);

  if (
    subject === 'Aftermatch registration failed'
    && emailSentTimestamp
    && now - emailSentTimestamp < interval
  ) {
    console.log('Email already sent recently. Skipping...');
    return; 
  }

  emailSentTimestamp = now;

  const msg = {
    to,
    from: 'email@email.com', // TODO: change this to a real email address
    subject,
    text,
    html,
  };

  try {
    await sgMail.send(msg);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
