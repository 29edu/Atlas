import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <>
            <Link to='/Fresh'>Fresh</Link>
            <Link to='/help/customer'>Customer Service</Link>
            <Link to='/mxplayer'>MX Player</Link>
            <Link to='/Sell'>Sell</Link>
            <Link to='/giftcard'>Gift Cards</Link>
        </>
    )
}