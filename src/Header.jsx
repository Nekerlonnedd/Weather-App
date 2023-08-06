import React from "react"

export default function Header(props) {



  return (
    <div className={props.className1}>
      <h1 className={props.className2}>{props.location}</h1>
      <h1 className={props.className3}>
        {Math.trunc(props.temperature) + "°"}
      </h1>
      <h1 className={props.className4}>
        {props.condition}
      </h1>
    </div>

  );
}
