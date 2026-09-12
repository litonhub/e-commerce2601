import React from 'react';
import { useSearchParams, Link } from 'react-router';
import { FaCheckCircle } from 'react-icons/fa';
import Container from '../components/layouts/Container';
import { useTranslation } from 'react-i18next'; // <-- Language Import

const PaymentSuccess = () => {
  const { t } = useTranslation(); // <-- Translation Hook
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order');

  return (
    <div className="py-20 bg-gray-50 min-h-[60vh] flex items-center justify-center font-pop">
      <Container>
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 text-center max-w-lg mx-auto">
          <div className="text-[#00B207] mb-6 flex justify-center">
            <FaCheckCircle size={64} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('payment.success_title', 'Payment Successful!')}
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            {t('payment.success_desc', 'Thank you for your purchase. Your order has been processed successfully.')}
            {orderId && (
              <span className="block mt-3 px-4 py-2 bg-gray-50 rounded-lg border border-gray-100 font-semibold text-gray-800">
                {t('payment.order_id', 'Order ID:')} {orderId}
              </span>
            )}
          </p>
          <div className="flex flex-col gap-3">
            <Link 
              to={orderId ? `/track-order?orderId=${orderId}` : "/track-order"} 
              className="w-full py-3.5 bg-[#00B207] text-white rounded-full font-semibold hover:bg-[#009206] transition shadow-md shadow-green-500/20"
            >
              {t('payment.view_status', 'View Order Status')}
            </Link>
            <Link 
              to="/shop" 
              className="w-full py-3.5 bg-gray-100 text-gray-700 rounded-full font-semibold hover:bg-gray-200 transition"
            >
              {t('payment.continue_shopping', 'Continue Shopping')}
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default PaymentSuccess;