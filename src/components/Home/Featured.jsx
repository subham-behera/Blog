import React from 'react';

function Featured({ image, title, description, postLink }) {
    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <img src={image} alt={title} className="w-full h-56 object-cover"/>
            <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-gray-600 mb-4">{description}</p>
                <a href={postLink} className="text-orange-500 font-semibold hover:underline">Read More</a>
            </div>
        </div>
    );
}

export default Featured;
