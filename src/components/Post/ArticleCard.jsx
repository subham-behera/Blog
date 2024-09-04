import React from "react";

const ArticleCard = ({ article }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg mb-6 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      <img src={article.image} alt={article.title} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2 text-indigo-600">{article.title}</h2>
        <p className="text-gray-700 mb-4">{article.summary}</p>
        <div className="text-gray-600 mb-4">
          <span>By {article.author} on {new Date(article.date).toLocaleDateString()}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {article.tags.map(tag => (
            <span key={tag} className="bg-indigo-100 text-indigo-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
