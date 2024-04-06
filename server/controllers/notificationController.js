import nodemailer from 'nodemailer';
import { google } from 'googleapis'; // Import the google object from googleapis

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendNotification(userEmail, taskTitle) {
  // console.log(userEmail,type)
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    // console.log(accessToken)
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: USER,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });
    // console.log(transport)

      console.log("kjkwk")
      const mailOptions = {
        from: `BalaVighnesh {<USER>}`,
        subject: `Task Remainder: ${taskTitle}`,
        text: `Complete Your task ${taskTitle}. Deadline is near.`,
      };
  
      const result = await transport.sendMail(mailOptions);
      console.log(result)
    


 
    // return result;
  } catch (error) {
    return error;
  }
}

// sendMail()
//   .then((result) => console.log('Mail sent', result))
//   .catch((err) => console.log(err));

export {sendNotification};