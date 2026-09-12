import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ResendTimer = ({
  seconds = 30,
  onResend,
}) => {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [counting, setCounting] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!counting) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCounting(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [counting]);

  const handleResend = async () => {
    if (loading || counting) return;

    try {
      setLoading(true);

      if (onResend) {
        await onResend();
      }

      toast.success("Verification code sent.");

      setTimeLeft(seconds);
      setCounting(true);

    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
        "Failed to resend code."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center gap-2 text-sm pt-1">

      <span className="text-grynine">
        Didn't receive the code?
      </span>

      <button
        type="button"
        disabled={counting || loading}
        onClick={handleResend}
        className={`font-semibold transition-colors duration-200
          ${
            counting || loading
              ? "text-gray-400 cursor-not-allowed"
              : "text-primary hover:underline"
          }`}
      >
        {loading ? "Sending..." : "Resend"}
      </button>

      {counting && (
        <span className="text-primary font-medium">
          ({timeLeft}s)
        </span>
      )}

    </div>
  );
};

export default ResendTimer;