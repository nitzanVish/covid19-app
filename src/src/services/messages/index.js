
import userMessages from './user';
import productMessages from './products';
import cartMessages from './cart';
import orderMessages from './order';

//Define messages for interacting with user

const basicMessage = {
    header:{
        succeeded : "Succeeded",
        failed: "Failed"
    },
    body: {
        tryAgain: "Please, try again",
        incorrectToken: "Incorrect Token, Please, try again",
        validation: "Please, Check your inputs",
        unauthorized: "Unauthorized"
    },
    userMessages,
    productMessages,
    cartMessages,
    orderMessages
}

export default basicMessage;