import React from 'react';
import Featured from '../components/Home/Featured';

function Home() {
    return (
        <div className="font-sans bg-gray-100 text-gray-900">
            {/* Navbar */}
            <header className="bg-gray-800 text-white shadow-lg">
                <nav className="container mx-auto flex justify-between items-center p-4">
                    <h1 className="text-3xl font-extrabold tracking-tight">My Blog</h1>
                    <ul className="flex space-x-8">
                        <li><a href="/" className="hover:text-orange-500 transition-colors">Home</a></li>
                        <li><a href="#about" className="hover:text-orange-500 transition-colors">About</a></li>
                        <li><a href="/post" className="hover:text-orange-500 transition-colors">Posts</a></li>
                        <li><a href="/create" className="hover:text-orange-500 transition-colors">Create</a></li>
                    </ul>
                </nav>
            </header>

            {/* Landing Section */}
            <section id="home" className="relative h-screen bg-cover bg-center" style={{ backgroundImage: 'url(https://cdn.pixabay.com/photo/2017/04/05/01/16/food-2203732_1280.jpg)' }}>
                <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-75"></div>
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white">
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">Welcome to My Blog</h1>
                    <p className="text-lg md:text-2xl mb-6 font-light tracking-wide">Your go-to source for the latest insights and stories.</p>
                    <a href="/post" className="bg-orange-500 hover:bg-orange-400 text-white py-3 px-8 rounded-lg font-semibold transition-transform transform hover:scale-105">
                        Read the Latest Posts
                    </a>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-16 bg-white text-center">
                <div className="container mx-auto">
                    <h2 className="text-4xl font-bold mb-4">About Us</h2>
                    <p className="text-gray-700 text-lg leading-relaxed">
                        My Blog is a platform where you can find insightful articles, tips, and stories across various topics.
                        We are committed to delivering content that informs, inspires, and entertains our readers.
                    </p>
                </div>
            </section>

            {/* Featured Posts Section */}
            <section className="py-16 bg-gray-100 text-center">
                <div className="container mx-auto">
                    <h2 className="text-4xl font-bold mb-8">Featured Posts</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <Featured 
                            image="https://cdn.pixabay.com/photo/2016/03/27/18/54/technology-1283624_1280.jpg" 
                            title="The Bizarre World of JavaScript Type Coercion" 
                            description="One of the most bizarre and often misunderstood aspects of JavaScript..." 
                            postLink="https://dev.to/subham_behera/the-bizarre-world-of-javascript-type-coercion-58h0" 
                        />
                        <Featured 
                            image="https://cdn.pixabay.com/photo/2024/04/09/03/04/ai-generated-8684869_1280.jpg" 
                            title="Uncovering Hidden Gems in JavaScript" 
                            description="JavaScript has a plethora of lesser-known, yet incredibly useful,..." 
                            postLink="https://dev.to/subham_behera/uncovering-hidden-gems-in-javascript-9bd" 
                        />
                        <Featured 
                            image="https://cdn.pixabay.com/photo/2024/06/14/12/15/developer-8829709_1280.jpg" 
                            title="The Quirky Side of C++: Weird Stuff" 
                            description="Let's dive into some of the weird and wonderful aspects of C++..." 
                            postLink="https://dev.to/subham_behera/the-quirky-side-of-c-weird-stuff-that-makes-us-love-and-hate-it-4k31" 
                        />
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-16 bg-white text-center">
                <div className="container mx-auto">
                    <h2 className="text-4xl font-bold mb-4">Contact Us</h2>
                    <p className="text-gray-700 text-lg mb-8">We'd love to hear from you! Reach out with any questions or feedback.</p>
                    <a href="mailto:contact@myblog.com" className="bg-orange-500 hover:bg-orange-400 text-white py-3 px-8 rounded-lg font-semibold transition-transform transform hover:scale-105">
                        Get in Touch
                    </a>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-6">
                <div className="container mx-auto text-center">
                    <p>&copy; {new Date().getFullYear()} My Blog. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default Home;
