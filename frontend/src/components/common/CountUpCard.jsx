import React from "react";
import ReactCountUp from "react-countup";

const CountUp = ReactCountUp.default || ReactCountUp;

const CountUpCard = ({
  end,
  title,
  suffix = "+",
  prefix = "",
  decimals = 0,
  duration = 3,
  cardClass = "",
  numberClass = "",
  titleClass = "",
}) => {
  return (
    <div className={cardClass}>
      <h2 className={numberClass}>
        <CountUp
          start={0}
          end={end}
          duration={duration}
          prefix={prefix}
          suffix={suffix}
          decimals={decimals}
          enableScrollSpy={true}
          scrollSpyOnce={true}
        >
          {({ countUpRef }) => <span ref={countUpRef} />}
        </CountUp>
      </h2>
      <p className={titleClass}>{title}</p>
    </div>
  );
};

export default CountUpCard;