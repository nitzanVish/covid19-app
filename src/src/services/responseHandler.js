
import basicMessages from './messages/index';

class ResponseHandel
{
    // Handel with response from server
    handelError(response)
    {
        const message = {
            header: basicMessages.header.failed,
            body: ''
        };
        
        if(response.data.INTERNAL_STATUS_CODE == 401){
            message.body = basicMessages.body.unauthorized;
        } else if (response.data.INTERNAL_STATUS_CODE == 402){
            message.body = basicMessages.body.validation;
        } else if (response.data.INTERNAL_STATUS_CODE == 400){
            message.body = basicMessages.body.incorrectToken;
        } else if (response.data.INTERNAL_STATUS_CODE == 403){
            message.body = basicMessages.userMessages.body.changeEmailAddress;
        } else if (response.data.INTERNAL_STATUS_CODE == 404){
            message.body = basicMessages.userMessages.body.changeName;
        } else if (response.data.INTERNAL_STATUS_CODE == 405){
            message.body = basicMessages.userMessages.body.incorrectInputs;
            
        } else if (response.data.INTERNAL_STATUS_CODE == 406){
            // req qty is bigger than inventory and inventory = 0
            if(response.data.DATA.addedQty == 0){
                message.body = basicMessages.productMessages.body.unAvailable;
            } else {
                //req qty is bigger than inventory and inventory > 0
                let itemOrItems = (response.data.DATA.addedQty > 1)? 'items':'item' ;
                message.body = `Only ${response.data.DATA.addedQty} ${itemOrItems} were added to cart` ;
            }
            
        }   else if (response.data.INTERNAL_STATUS_CODE == 407){
            message.body = basicMessages.orderMessages.body.unavailable;
        } else if (response.data.INTERNAL_STATUS_CODE == 408){
            message.body = basicMessages.productMessages.body.quantityError;
        }
        else {
            message.body = basicMessages.body.tryAgain;
        }
        return message;
    }
}
export default new ResponseHandel();