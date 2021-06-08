import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { categoryIdsToObjects } from './CategoryIdsToOjbects';
const source = require('./UNSPCSearch.json');

function getCatText(values) {
  if (values.length === 0) {
    return 'Select Categories';
  }
  return `${values.length} Categories Selected`;
}

export default function SearchBar() {
  const [value, setValue] = useState('');
  const [categories, setCategories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (value) {
      const re = new RegExp(_.escapeRegExp(value), 'i');
      const isMatch = (result) => re.test(result.text);
      const results = _.filter(source.content, isMatch);
  
      const resultCodes = categoryIdsToObjects(categories).map(
        (value) => value.code
      );
      const filteredResults = results
        .slice(0, 200)
        .filter((cat) => !resultCodes.includes(cat.code));
  
      setSearchResults(filteredResults.slice(0, 10));
    }
  }, [value, categories]);

  const onSelect = (category) => setCategories([...categories, category.code]);

  const onRemove = (category) => setCategories(categories.filter((c) => c !== category.code));

  return (
    <div className="box">
      <div className="">
          <h2>Search for categories</h2>
          <input 
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
      <div className="flex">
      {searchResults.length > 0 && (
        <div>
          <h2>Results</h2>
          <ul className="list">
            {searchResults.map((value) => (
              <li
                className="pointer"
                onClick={() => onSelect(value)}
              >
                {value.text}
              </li>
            ))}
          </ul>
        </div>
      )}
        {categories.length > 0 && (
          <section>
            <h2>{getCatText(categories)}</h2>
            <ul className="flex flex-col list-none">
              <li className="pointer">
                {categoryIdsToObjects(categories).map((category) => <li onClick={() => onRemove(category)}>{category.text}</li>)}
              </li>
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
