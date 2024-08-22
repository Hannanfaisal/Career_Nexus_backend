const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

const subscriptionController = {

     async subscribe(req,res){

        const plan = req.query.plan

        if (!plan) {
            return res.send('Subscription plan not found')
        }
    
        let priceId;
    
        switch (plan.toLowerCase()) {
            case 'basic': 
                priceId = 'price_1PqVPgJeZe4NkZOUzF31iE7X'
                break
    
            case 'pro':
                priceId = 'price_1PqVReJeZe4NkZOU9DCdDORh'
                break
    
            default:
                return res.send('Subscription plan not found')
        }


        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            line_items: [
                {
                    price: priceId,
                    quantity: 1
                }
            ],
            success_url: 'http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'http://localhost:5173/cancel'
        });

        console.log(session)

        res.redirect(session.url)

    } 

    

}


module.exports = subscriptionController;