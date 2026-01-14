import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const ses = new SESClient({ region: "ap-south-1" });

export const sendEmail = async ({
  to,
  subject,
  htmlBody
}: {
  to: string;
  subject: string;
  htmlBody: string;
}) => {
  const params = {
    Destination: {
      ToAddresses: [to]
    },
    Message: {
      Subject: {
        Data: subject,
        Charset: "UTF-8"
      },
      Body: {
        Html: {
          Data: htmlBody,
          Charset: "UTF-8"
        }
      }
    },
    Source: process.env.SES_FROM
  };

  await ses.send(new SendEmailCommand(params));
};
