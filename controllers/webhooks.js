import { Webhook } from "svix";
import Stripe from "stripe";
import Purchase from "../models/PurchaseSchema.js";
import User from "../models/User.js";
import Course from "../models/Course.js";

// API controller function to manage Clerk user with database
export const clerkWebhooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        await whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        });

        const { data, type } = req.body;

        switch (type) {
            case "user.created": {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    imageUrl: data.image_url,
                }
                await User.create(userData);
                res.json({});
                break;
            }

            case "user.updated": {
                const userData = {
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    imageUrl: data.image_url,
                }

                await User.findByIdAndUpdate(data.id, userData);
                res.json({});
                break;
            }

            case "user.deleted": {
                await User.findByIdAndDelete(data.id);
                res.json({});
                break;
            }

            default:
                res.json({});
                break;
        }
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
}

export const stripeWebhooks = async (req, res) => {
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers['stripe-signature'];

    let event;
    try {
        // req.body must be a raw Buffer provided by express.raw
        event = stripeInstance.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        console.log('[Stripe] Event:', event.type);

        switch (event.type) {
            case 'payment_intent.succeeded': {
                const paymentIntent = event.data.object;
                const paymentIntentId = paymentIntent.id;

                const session = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntentId,
                });

                const { purchaseId } = session.data[0].metadata;

                const purchaseData = await Purchase.findById(purchaseId);

                const userData = await User.findById(purchaseData.userId);
                const courseData = await Course.findById(purchaseData.courseId.toString());

                courseData.enrolledStudents.push(userData._id);
                await courseData.save();

                userData.enrolledCourses.push(courseData._id);
                await userData.save();

                purchaseData.status = 'completed';
                await purchaseData.save();

                break;
            }
            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object;
                const paymentIntentId = paymentIntent.id;

                const session = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntentId,
                });

                const { purchaseId } = session.data[0].metadata;

                const purchaseData = await Purchase.findById(purchaseId);

                purchaseData.status = 'failed';
                await purchaseData.save();

                break;
            }
            default:
                console.log(`[Stripe] Unhandled event type ${event.type}`);
        }

        res.status(200).json({ received: true });
    } catch (error) {
        console.error('[Stripe] Webhook error:', error.message);
        res.status(400).json({ success: false, message: error.message });
    }

}