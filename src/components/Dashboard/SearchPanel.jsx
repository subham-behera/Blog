const SearchPanel = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="flex items-center bg-white dark:bg-gray-800 shadow rounded-md px-4 py-2 w-full max-w-sm">
      <input
        type="text"
        placeholder="Search posts..."
        className="w-full bg-transparent focus:outline-none text-gray-700 dark:text-gray-200"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default SearchPanel;
