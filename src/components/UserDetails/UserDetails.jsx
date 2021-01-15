import React from 'react'
import { useParams, useHistory } from "react-router-dom";

const UserDetails = () => {
    const params = useParams(),
        history = useHistory(),
        user = history.location.state || params
    return (
        <div>
            <ul>
                {Object.entries(user).map((val, key) => (
                    <li key={key}>{val[0]}: {val[1]}</li>
                ))}
            </ul>
        </div>
    )
}

export default UserDetails