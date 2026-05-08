# type

    It tells what kind of action/event/ job/ message this is
    It answers the question : "What is happening?"
    like "DELIVER_PACKAGE"
        "RETURN_PACKAGE"
        "CANCEL_ORDER"

        In Notification System : 
            type: "EMAIL",
            type: "SMS",
            type: "PUSH_NOTIFICATION"

        In job Queue
            type: "SEND_MESSAGE_EMAIL"
            type: "PROCESS PAYMENT"
            type: "GENERATE INVOICE"

        In Event System
            type: "USER_CREATED",
            type: "ORDER_PLACED",
            type: "PASSWORD_RESET"

    Without type i don't know the object
    I have to use if-else and it will look ugly

## Payload

    Payload is the actual data needed to perform that action
    It answers "What information do i need to do this job?"

    Example:-
        Type: "DELIVERY_PACKAGE"
        Payload:- Address, Phone_number, item, instructions

        Email Job:-
            {
                type: "SEND_EMAIL",
                payload: {
                    to: "user@gmail.com",
                    subject: "Welcome",
                    body: "Thanks for joining
                }
            }

        Payment Job:-
            {
                type: "PROCESS_PAYMENT",
                payload: {
                    userId: 123,
                    amount: 499,
                    currency: "INR"
                }
            }

        User Event:-
            {
                type: "USER_CREATED",
                payload: {
                    userId: 456,
                    name: "Edison",
                    email: "edison@gmail.com"
                }
            }

        Putting directly is bad like
            constructor(email, action, amount, message, phone)

## Restore State

    Scenario:
        A user submit the details and saved in database. Now worker picks the task and worker crashes the server or server restarts,
        and reloads tasks from storage.

        Now the question is 
            Should the task restart like a brand new task?
            or continue knowing?
                It already started
                It failed once
                It has 2 retries left
                It already has an ID
            Continue where it left off -> This is restore state

