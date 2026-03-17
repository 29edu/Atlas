import { TASK_PRIORITIES } from "../../shared/config/taskPriorities.js";

export async function createOrderTasks(order) {
    const tasks = [
        {
            type: "PAYMENT_PROCESS",
            priority: TASK_PRIORITIES.PAYMENT,
            orderId: order._id
        },
        {
            type: "RESERVE_INVENTORY",
            priority: TASK_PRIORITIES.INVENTORY,
            orderId: order._id
        },
        {
            type: "SEND_CONFIRMATION_EMAIL",
            priority: TASK_PRIORITIES.EMAIL,
            orderId: order._id
        },
        {
            type: ""
        }
    ]
}

// When the order gets placed