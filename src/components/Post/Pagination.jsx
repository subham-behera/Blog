import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [...Array(totalPages).keys()].map(n => n + 1);

  return (
    <div className="flex justify-center mt-8">
      <nav>
        <ul className="inline-flex items-center space-x-2">
          <li>
            <button 
              onClick={() => onPageChange(currentPage - 1)} 
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-l-lg border ${currentPage === 1 ? 'text-gray-300 bg-gray-100 cursor-not-allowed' : 'text-indigo-600 bg-white border-gray-300 hover:bg-indigo-50 hover:text-indigo-800'}`}>
              Previous
            </button>
          </li>
          {pages.map(page => (
            <li key={page}>
              <button
                onClick={() => onPageChange(page)}
                className={`px-4 py-2 border ${page === currentPage ? 'text-white bg-indigo-600' : 'text-indigo-600 bg-white border-gray-300 hover:bg-indigo-50 hover:text-indigo-800'}`}>
                {page}
              </button>
            </li>
          ))}
          <li>
            <button 
              onClick={() => onPageChange(currentPage + 1)} 
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-r-lg border ${currentPage === totalPages ? 'text-gray-300 bg-gray-100 cursor-not-allowed' : 'text-indigo-600 bg-white border-gray-300 hover:bg-indigo-50 hover:text-indigo-800'}`}>
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
