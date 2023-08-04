import React from "react"


export default function Hourly(props) {



  return (
<div >
  <p className={props.className}>{props.time}</p>
  <img src={props.image} alt="condition" />
  <p>{Math.trunc(props.temperature) + "°"}</p>

  </div>
  );
}
