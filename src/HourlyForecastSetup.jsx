import React from "react"

export default function HourlyForecastSetup(props) {



  return (
    <div className={props.className1}>
      <p><i className={props.className2}></i> HOURLY FORECAST</p>
      <div className={props.className3}>
    {props.mapForecast}
    </div>
    </div>
  );
}
