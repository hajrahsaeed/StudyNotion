import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { handlePaymentSuccess } from "../../services/operations/paymentAPI";

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get("session_id");

        if (sessionId && token) {
            handlePaymentSuccess(sessionId, token, navigate, dispatch);
        } else {
            navigate("/dashboard/enrolled-courses");
        }
    }, [token, navigate, dispatch]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold">Processing your payment...</h1>
        </div>
    );
};

export default PaymentSuccess;
