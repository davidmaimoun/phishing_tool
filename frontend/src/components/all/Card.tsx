import React from "react";

interface CardProps {
    title?: string;
    children: React.ReactNode;
}

const Card:React.FC<CardProps> = ({ title, children }) => {
    return (
        <div className="card">
            {title && <div className="card-title">{title}</div>}
        <div className="card-content">{children}</div>
        </div>
    )
}

export default Card;