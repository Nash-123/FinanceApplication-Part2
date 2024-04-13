import express from "express";
import db from "@repo/db/client";
const app = express();

app.use(express.json());

app.get("/hdfcWebhook", async (req,res) => {
    // TODO: -Adding ZOD valiation here 
    // Check if request actually came from hdfc bank , use a webhook secret here

    try {
    const paymentInformation: {token: String;
    userId: String;
    amount: String} = {
        token: req.body.token,
        userId: req.body.user_identifier,
        amount: req.body.amount,
    };
     
   

    // Update the balance for the user
    await db.balance.update({
        where: {
            userId: userId
        },
        data: {
            amount: {
                increment: paymentInformation.amount
            }
        }
    });

    await db.onRampTransaction.update({
        where: {
            userId: userId
        },
        data: {
            status: "Success"
        }
    });

    res.json({
        message: "Captured"

    }) 

} catch(e) {
    res.status(411).json({
        message: `Transaction is not Successfull..Error while processing webhook`,
    })
}
})

app.listen(3003);


// balances
// onRampTransactions
