import React, { useState, useRef, useEffect } from 'react';
import Dropdown from './Dropdown';

const mockData = [
  { column: 'Name', value: 'John Doe' },
  { column: 'Email', value: 'john.doe@example.com' },
  { column: 'Address', value: '123 Main St' },
];

const ColumnSelector = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [filteredItems, setFilteredItems] = useState(mockData);
  const [currentQuery, setCurrentQuery] = useState('');
  const editableDivRef = useRef(null);
  const dropdownRef = useRef(null);
  const initialDropdownPosition = useRef(null);

  const handleInputChange = () => {
    const editableDiv = editableDivRef.current;
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);

    if (editableDiv && range) {
      const { startContainer, startOffset } = range;

      if (startContainer.nodeType === Node.TEXT_NODE) {
        const textContent = startContainer.textContent;
        const slashIndex = textContent.lastIndexOf('/');

        if (slashIndex !== -1 && startOffset > slashIndex) {
          const query = textContent.slice(slashIndex + 1, startOffset).toLowerCase();

          setCurrentQuery(query);
          setFilteredItems(
            mockData.filter((item) =>
              item.column.toLowerCase().includes(query)
            )
          );

          if (textContent[startOffset - 1] === '/' || !initialDropdownPosition.current) {
            const rect = range.getBoundingClientRect();
            initialDropdownPosition.current = { top: rect.bottom, left: rect.left };
            setDropdownPosition(initialDropdownPosition.current);
          }

          setShowDropdown(true);
        } else {
          setShowDropdown(false);
        }
      }
    }
  };

  const handleSelectItem = (item) => {
    const editableDiv = editableDivRef.current;
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);

    console.log('selected');
    console.log(selection, range);

    if (editableDiv && range) {
      if (range.startContainer.nodeType === Node.TEXT_NODE) {
        const textContent = range.startContainer.textContent;
        const slashIndex = textContent.lastIndexOf('/');

        if (slashIndex !== -1) {
          range.setStart(range.startContainer, slashIndex);
          range.deleteContents();
        }
      }

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

      const space = document.createTextNode(' ');

      range.insertNode(space);
      range.insertNode(chip);

      selection.collapseToEnd();
    }

    setShowDropdown(false);
    initialDropdownPosition.current = null;
  };

  const handleClickOutside = (event) => {
    if (
      editableDivRef.current &&
      !editableDivRef.current.contains(event.target) &&
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target)
    ) {
      setShowDropdown(false);
      initialDropdownPosition.current = null;
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
      {showDropdown && filteredItems.length > 0 && (
        <Dropdown
          ref={dropdownRef}
          items={filteredItems}
          position={dropdownPosition}
          onSelect={handleSelectItem}
        />
      )}
    </div>
  );
};

export default ColumnSelector;
