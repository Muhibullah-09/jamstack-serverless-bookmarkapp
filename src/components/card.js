import React from 'react';

export default function Card({ url, title }) {
    return <div className="card">
        <a href={url} target="_blank" rel="noreferrer" className="url"><b>{url}</b></a>
    </div>
}