document.addEventListener('DOMContentLoaded', function () {
  const sectionsContainer = document.getElementById('sections-container');

  // Enable sortable for menu items on the left side
  const menuItems = document.querySelectorAll('.menu-item');

  menuItems.forEach(item => {
      item.addEventListener('click', function () {
          const sectionId = this.getAttribute('data-section');
          let section = document.getElementById(sectionId);

          // If section does not exist, create it
          if (!section) {
              section = createSection(sectionId, `SECTION ${sectionId.replace('section', '')}`);
              sectionsContainer.appendChild(section);

              // Add sortable functionality to the new section list
              makeListSortable(section.querySelector('.sortable-list'));
          }

          section.scrollIntoView({ behavior: 'smooth' });
      });
  });

  // Function to create a new section
  function createSection(sectionId, sectionTitle) {
      const section = document.createElement('div');
      section.id = sectionId;
      section.classList.add('section');

      const sectionHeader = document.createElement('div');
      sectionHeader.classList.add('section-header');

      const title = document.createElement('span');
      title.textContent = sectionTitle;

      const addButton = document.createElement('button');
      addButton.classList.add('add-btn');
      addButton.textContent = '+';

      addButton.addEventListener('click', function () {
          const list = section.querySelector('.sortable-list');
          const itemCount = list.children.length + 1; // Count existing items for numbering
          const newItem = createListItem(`New Item`, itemCount);
          list.appendChild(newItem);
          makeListSortable(list); // Make the list sortable after adding new item
          updateListNumbers(list); // Update numbers after adding
      });

      sectionHeader.appendChild(title);
      sectionHeader.appendChild(addButton);
      section.appendChild(sectionHeader);

      const list = document.createElement('ul');
      list.classList.add('sortable-list');

      // Add some default list items for testing
      const item1 = createListItem('Sample 1', 1);
      const item2 = createListItem('Sample 2', 2);

      // Create nested list under Sample 2
      const nestedList = document.createElement('ul');
      nestedList.classList.add('nested-list');

      // Add nested items Demo 1 to Demo 5 without numbering
      for (let i = 1; i <= 5; i++) {
          const nestedItem = createListItem(`Demo ${i}`, null); // No number for nested items
          nestedList.appendChild(nestedItem);
      }

      // Append nested list to Sample 2
      item2.querySelector('.this-wrap').appendChild(nestedList);
      list.appendChild(item1);
      list.appendChild(item2);

      section.appendChild(list);

      return section;
  }

  // Function to create a list item with the correct "this-wrap" structure
  function createListItem(text, number) {
      const listItem = document.createElement('li');
      listItem.classList.add('list-item');

      // Create the wrapper div
      const wrapDiv = document.createElement('div');
      wrapDiv.classList.add('this-wrap');
      
      // Create the title span
      const titleSpan = document.createElement('span');
      titleSpan.classList.add('title');

      // Create the bullet span for numbering
      const bulletSpan = document.createElement('span');
      bulletSpan.classList.add('bullet');
      bulletSpan.textContent = number !== null ? `${number}` : ''; // Only add number if it exists

      // Add text to the title span
      const textSpan = document.createElement('span');
      textSpan.textContent = ` ${text}`; // Space before text for clarity

      titleSpan.appendChild(bulletSpan);
      titleSpan.appendChild(textSpan);

      const deleteIcon = document.createElement('span');
      deleteIcon.classList.add('delete-icon');
      deleteIcon.innerHTML = '<i class="fa-regular fa-trash-can"></i>'; // Unicode for trash bin

      deleteIcon.addEventListener('click', function () {
          listItem.remove(); // Delete the list item
          updateListNumbers(listItem.parentElement); // Update numbers after deletion
      });

      wrapDiv.appendChild(titleSpan);
      wrapDiv.appendChild(deleteIcon);

      // Append the wrapper to the list item
      listItem.appendChild(wrapDiv);

      return listItem;
  }

  // Make a list sortable using SortableJS
  function makeListSortable(list) {
      new Sortable(list, {
          group: 'shared',
          animation: 150,
          ghostClass: 'sortable-ghost',
          handle: '.this-wrap',
          onEnd: function () {
              updateListNumbers(list); // Update numbers after sorting
          }
      });
  }

  // Function to update numbers of the list items
  function updateListNumbers(list) {
      const items = list.querySelectorAll('.sortable-list .list-item');
      items.forEach((item, index) => {
          const bulletSpan = item.querySelector('.sortable-list .this-wrap .bullet');
          bulletSpan.textContent = `${index + 1}`; // Update bullet number
          const textSpan = item.querySelector('.this-wrap .title span:last-child'); // Get the last span for text
          textSpan.textContent = ` ${textSpan.textContent.trim()}`; // Maintain text formatting
      });
  }

  // Automatically create Sections 2, 3, and 4 on page load
  const initialSections = ['section2', 'section3'];

  initialSections.forEach(sectionId => {
      const section = createSection(sectionId, `SECTION ${sectionId.replace('section', '')}`);
      sectionsContainer.appendChild(section);

      // Add sortable functionality to these sections
      makeListSortable(section.querySelector('.sortable-list'));

      // Add sortable functionality to nested lists as well
      const nestedLists = section.querySelectorAll('.nested-list');
      nestedLists.forEach(nestedList => {
          makeListSortable(nestedList);
      });
  });
});
