import React from "react";

export default function JoinRoom({roomAvailable, enable}){
    return (
            <button style={{margin: "10px 0 10px 0"}}  type="button" className="btn btn-primary" disabled = {enable}>{roomAvailable}</button>
    )
}