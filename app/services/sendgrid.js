import sendgrid from 'sendgrid';
import dotenv from 'dotenv';

dotenv.config({ silent: true });

export const sendEmail = (email, name, token) => {
  const helper = sendgrid.mail;
  const fromEmail = new helper.Email('admin@3fp.me');
  const toEmail = new helper.Email(email);
  const subject = 'Welcome to 3fp';
  const content = new helper.Content('text/plain', `Welcome, ${name}! Please use the following code: ${token}`);
  const mail = new helper.Mail(fromEmail, subject, toEmail, content);

  const sg = sendgrid(process.env.SENDGRID_API_KEY);
  const request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON(),
  });

  sg.API(request, (error, response) => {
    console.log(response.statusCode);
    console.log(response.body);
    console.log(response.headers);
  });
};

export const sendGameEmail = (email, name, location, time, cell) => {
  const helper = sendgrid.mail;
  const fromEmail = new helper.Email('admin@3fp.me');
  const toEmail = new helper.Email(email);
  const subject = 'You have been matched';
  const content = new helper.Content('text/plain', `Hey, ${name}! You have a game at ${location} at ${time}. Host's cell is ${cell}`);
  const mail = new helper.Mail(fromEmail, subject, toEmail, content);

  const sg = sendgrid(process.env.SENDGRID_API_KEY);
  const request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON(),
  });

  sg.API(request, (error, response) => {
    console.log(response.statusCode);
    console.log(response.body);
    console.log(response.headers);
  });
};
