// domain/.netlify/functions/create-payment-intent

const express = require("express")
const app = express()
require('dotenv').config()

const cors = require('cors')
app.use(cors({
    origin: '*'
}));

const stripe = require('stripe')("sk_test_51KlGCSSA2A7x6rOuyxcqXgiEfddlBb0HESp2ithzXnoEjv7WMEWS5zLq8h20BBlM1UDqz9JBYTAl8jejRGNsRMCE00R6SefHXt")


app.get('/',(req,res)=>res.send("hloooo"))
app.post("/create",async(req,res)=> {
    console.log("client")
    console.log(req,"seshu")

 

  
    try {
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 4000,
        currency: 'usd',
      })
      console.log(paymentIntent.client_secret)

      res.send({clientSecret: paymentIntent.client_secret })
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ msg: error.message }),
      }
    }
  
    

})
app.listen(4000,()=>{console.log("server running in 4000")})

