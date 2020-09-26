import aws from 'aws-sdk'

export const sendEmail = async (to: string[] = [], subject: string, message: string): Promise<{ error: string , sent: boolean }> => {
    let error: any = ''
    let sent: boolean = false
    const eParams = {
        Destination: {
            ToAddresses: to
        },
        Message: {
            Subject: {
                Data: subject
            },
            Body: {
                Text: {
                    Data: message
                },
            }
        },
        Source: `<no-reply@loose.dev>`
    };
    const ses = new aws.SES({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION
    });
    await new Promise(resolve => {
      ses.sendEmail(eParams, function(err, data){
        if(err) {
          error = err
        } else {
          sent = true
        }
        resolve()
      })
    })
    return { error, sent }
}
