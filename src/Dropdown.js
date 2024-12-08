import React, { useState, useEffect, forwardRef } from 'react';

const Dropdown = forwardRef(({ items, position, onSelect }, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % items.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + items.length) % items.length);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      onSelect(items[selectedIndex]);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedIndex, items, onSelect]);

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        width: '200px',
        maxHeight: '150px',
        overflowY: 'auto',
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        borderRadius: '4px',
        zIndex: 1000,
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
      }}
    >
      {items.map((item, index) => (
        <div
          key={item.column}
          onMouseEnter={() => setSelectedIndex(index)} // Highlight on hover
          onClick={() => onSelect(item)}
          style={{
            padding: '10px',
            cursor: 'pointer',
            backgroundColor: index === selectedIndex ? '#f1f1f1' : '#fff',
            borderBottom: '1px solid #eee',
          }}
        >
          {item.column}
        </div>
      ))}
    </div>
  );
});

export default Dropdown;
