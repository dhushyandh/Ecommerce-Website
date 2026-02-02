import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function StripeCheckoutCancel() {
    const navigate = useNavigate();

    useEffect(() => {
        toast.info('Payment cancelled.', { position: 'bottom-right' });
        navigate('/payment');
    }, [navigate]);

    return null;
}
