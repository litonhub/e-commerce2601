import Countdown from "react-countdown";

const CountdownTimer = ({
  endDate,

  numberClass = "",
  labelClass = "",
  separatorClass = "",
  wrapperClass = "",
  numberGap = "gap-3",
  labelGap = "gap-8",
  endedText = "Offer Ended",
}) => {
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return (
        <h3 className="text-xl font-bold">
          {endedText}
        </h3>
      );
    }

    return (
      <div className={wrapperClass}>
        {/* Number Row */}
        <div className={`flex justify-center items-center ${numberGap}`}>
          <h2 className={numberClass}>
            {String(days).padStart(2, "0")}
          </h2>

          <span className={separatorClass}>:</span>

          <h2 className={numberClass}>
            {String(hours).padStart(2, "0")}
          </h2>

          <span className={separatorClass}>:</span>

          <h2 className={numberClass}>
            {String(minutes).padStart(2, "0")}
          </h2>

          <span className={separatorClass}>:</span>

          <h2 className={numberClass}>
            {String(seconds).padStart(2, "0")}
          </h2>
        </div>

        {/* Label Row */}
        <div className={`flex justify-center mt-2 ${labelGap}`}>
          <p className={labelClass}>DAYS</p>
          <p className={labelClass}>HOURS</p>
          <p className={labelClass}>MINS</p>
          <p className={labelClass}>SECS</p>
        </div>
      </div>
    );
  };

  return (
    <Countdown
      date={endDate}
      renderer={renderer}
    />
  );
};

export default CountdownTimer;