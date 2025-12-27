async function paymentHandler(payload) {
    const {to, from, amount} = payload;

    console.log(`The ${from} has send ${amount}  to ${to}`);

    await new Promise((resolve) => {
        setTimeout(() => {
            console.log("Wait 3 sec to send the payment");
            resolve();
        })
    })

    if(Math.random() < 0.5) {
        throw new Error("Failed to send the Payment");
    }
    console.log("Payment has been done successfully")
}

export {
    paymentHandler
}