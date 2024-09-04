import React, { useState, useEffect } from "react";
import SearchBar from "../components/Post/SearchBar";
import ArticleCard from "../components/Post/ArticleCard";
import Sidebar from "../components/Post/Sidebar";
import Pagination from "../components/Post/Pagination";
import { BsThreeDots } from "react-icons/bs";
import { MdNotificationsNone } from "react-icons/md";

const Post = () => {
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    fetch('/articles.json')
      .then(response => response.json())
      .then(data => setArticles(data))
      .catch(error => console.error('Error fetching articles:', error));
  }, []);

  useEffect(() => {
    const filtered = articles.filter(article =>
      (activeCategory === "All" || article.category === activeCategory) &&
      article.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredArticles(filtered);
  }, [articles, searchTerm, activeCategory]);

  const categories = ["All", "React", "JavaScript", "CSS", "HTML", "Web Development"];
  const tags = ["React", "JavaScript", "CSS", "HTML", "Web Development", "Tailwind"];

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-row justify-between items-center mb-6">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <a href="/dashboard" className="flex flex-row items-center gap-x-3">
            <MdNotificationsNone className="text-2xl"/>
            <img src="https://cdn.pixabay.com/photo/2020/12/16/04/15/man-5835659_1280.jpg"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex flex-col text-sm">
              <span className="font-bold">Name</span>
              <span>Role</span>
            </div>
            <BsThreeDots className="text-xl"/>
          </a>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {filteredArticles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
            <Pagination />
          </div>
          <Sidebar 
            categories={categories} 
            tags={tags} 
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory} 
          />
        </div>
      </div>
    </div>
  );
};

export default Post;
