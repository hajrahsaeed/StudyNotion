import { toast } from "react-hot-toast";
import { studentEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";
import { loadStripe } from "@stripe/stripe-js";

const { COURSE_PAYMENT_API, COURSE_VERIFY_API, SEND_PAYMENT_SUCCESS_EMAIL_API } = studentEndpoints;

export async function buyCourse(token, courses, userDetails, navigate, dispatch) {
    const toastId = toast.loading("Loading...");
    try {
        // Initiate the order
        const orderResponse = await apiConnector("POST", COURSE_PAYMENT_API, 
                                { courses },
                                {
                                    Authorisation: `Bearer ${token}`,
                                });

        if (!orderResponse.data.success) {
            throw new Error(orderResponse.data.message);
        }
        console.log("PRINTING orderResponse", orderResponse);

        // Load the Stripe object using the public key
        const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
        if (!stripe) {
            throw new Error("Stripe failed to load.");
        }
        console.log("Stripe Loaded:", stripe);
        const sessionId = orderResponse.data.sessionId;

        // Redirect to Stripe's checkout
        const { error } = await stripe.redirectToCheckout({
            sessionId,
        });

        if (error) {
            console.log("Stripe Checkout Error:", error);
            toast.error("Could not redirect to Stripe checkout");
            return;
        }
        
        // No need to handle payment result here as user will be redirected

    } catch (error) {
        console.log("PAYMENT API ERROR.....", error);
        toast.error("Could not make Payment");
    }
    toast.dismiss(toastId);
}


export async function handlePaymentSuccess(sessionId, token, navigate, dispatch) {
    const toastId = toast.loading("Verifying Payment....");
    dispatch(setPaymentLoading(true));
    try {
        const bodyData = { session_id: sessionId };
        const response = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {
            Authorisation: `Bearer ${token}`,
        });

        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        
        toast.success("Payment Successful, you are added to the course");

        // Call the function to send the payment success email
        await sendPaymentSuccessEmail(sessionId, token);
        navigate("/dashboard/enrolled-courses");
        dispatch(resetCart());
    } catch (error) {
        console.log("PAYMENT VERIFY ERROR....", error);
        toast.error("Could not verify Payment");
    }
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
}


async function sendPaymentSuccessEmail(sessionId, token) {
    try {
        await apiConnector("POST", SEND_PAYMENT_SUCCESS_EMAIL_API, {
            sessionId,
        }, {
            Authorisation: `Bearer ${token}`
        });
    } catch (error) {
        console.log("PAYMENT SUCCESS EMAIL ERROR....", error);
    }
}
