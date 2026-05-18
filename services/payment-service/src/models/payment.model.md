
# Payment Model

    I am taking order_id , not card Id because cart me hota hai ke the quanity of product can change 
    and new items can be added or removed. So, its not fixed and suppose if i connect my payment gateway to card then
    I done payment and after that user change the card, then it will affect the orders bought by the user. 
    
    After Adding in cart -> User click Checkout -> A fixed order is created and i can use that for payment.