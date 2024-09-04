import React from "react";

const Sidebar = ({ categories, tags, activeCategory, setActiveCategory }) => {
  return (
    <aside>
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h3 className="text-xl font-bold mb-4 text-indigo-600">Categories</h3>
        <ul>
          {categories.map(category => (
            <li key={category} className="mb-2">
              <button 
                onClick={() => setActiveCategory(category)} 
                className={`text-lg ${activeCategory === category ? 'text-indigo-800 font-bold' : 'text-indigo-600'} hover:underline`}>
                {category}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-indigo-600">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <span key={tag} className="bg-indigo-100 text-indigo-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
