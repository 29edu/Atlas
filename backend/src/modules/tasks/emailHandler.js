
async function emailHandler(payload) {
    const {to, from , subject, content} = payload;

    console.log(`
        to: ${to}
        from : ${from}
        subject: ${subject}
        content: ${content}`
    )

    await new Promise((resolve) => {
        setTimeout(() => {
            console.log("Wait 3 sec to finish sending the email.");
            resolve();
        }, 3000)
    })

    if(Math.random() < 0.5) {
        throw new Error('Failed to send the email');
    }

    console.log("Email has been sent successfully");
}

export {
    emailHandler
}

// Question come, What if i use throw new Error, then it will be catched by catch block and 
// the message written in that will be sent to error.message
// throw new Error('Task is failed') creates an Error object like name: 'Error', message: 'Task is failed'
// stack: "..."