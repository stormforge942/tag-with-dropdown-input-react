import React, { useState, useRef } from 'react';
import Dropdown from './Dropdown';

const mockData = [
  { column: 'Name', value: 'John Doe' },
  { column: 'Email', value: 'john.doe@example.com' },
  { column: 'Address', value: '123 Main St' },
  // Add more mock data as needed
];

const ColumnSelector = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [dropdownItems, setDropdownItems] = useState(mockData);
  const editableDivRef = useRef(null);

  const handleInputChange = () => {
    const editableDiv = editableDivRef.current;
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);

    if (editableDiv && range) {
      const { startContainer, startOffset } = range;

      // Check if the cursor is within a text node and `/` is just typed
      if (
        startContainer.nodeType === Node.TEXT_NODE &&
        startContainer.textContent[startOffset - 1] === '/'
      ) {
        const rect = range.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom,
          left: rect.left,
        });
        setShowDropdown(true);
      } else {
        setShowDropdown(false);
      }
    }
  };

  const handleSelectItem = (item) => {
    const editableDiv = editableDivRef.current;
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);

    if (editableDiv && range) {
      // Remove the `/` character
      if (range.startContainer.nodeType === Node.TEXT_NODE) {
        range.setStart(range.startContainer, range.startOffset - 1);
        range.deleteContents();
      }

      // Create a chip element
      const chip = document.createElement('span');
      chip.contentEditable = 'false';
      chip.innerText = item.column;
      chip.style.cssText = `
        display: inline-block;
        background-color: #e0e0e0;
        border-radius: 15px;
        padding: 5px 10px;
        margin: 2px;
        font-size: 14px;
        cursor: pointer;
      `;

      const space = document.createTextNode(' '); // Add space after the chip

      range.insertNode(space);
      range.insertNode(chip);

      selection.collapseToEnd(); // Move the cursor after the chip
    }

    // Reset dropdown visibility
    setShowDropdown(false);
  };

  return (
    <div style={{ position: 'relative', width: '100%', padding: '10px' }}>
      <div
        ref={editableDivRef}
        contentEditable
        onInput={handleInputChange}
        suppressContentEditableWarning
        style={{
          width: '100%',
          minHeight: '100px',
          padding: '10px',
          fontSize: '16px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxSizing: 'border-box',
        }}
        placeholder="Type here..."
      />
      {showDropdown && (
        <Dropdown
          items={dropdownItems}
          position={dropdownPosition}
          onSelect={handleSelectItem}
        />
      )}
    </div>
  );
};

export default ColumnSelector;
