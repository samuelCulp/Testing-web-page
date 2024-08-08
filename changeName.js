document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(jsonData => {
            window.data = jsonData.data;
            window.namingConventions = jsonData.namingConventions;
            updateTable('ASKIT', 'ASKITD');
        })
        .catch(error => {
            console.error('Error loading department data:', error);
        });

    const searchButton = document.getElementById('search-button');
    searchButton.addEventListener('click', handleSearch);
});

function updateTable(category, department) {
    updateNamingConventionTable(category);
    updateDepartmentContactTable(department);
}

function updateNamingConventionTable(category) {
    const table = document.getElementById('naming-convention-table').querySelector('tbody');
    table.innerHTML = '';

    const names = namingConventions[category] || [];

    const rows = 9;
    const columns = 7;

    let nameIndex = 0;
    for (let i = 0; i < rows; i++) {
        const tr = document.createElement('tr');
        for (let j = 0; j < columns; j++) {
            const td = document.createElement('td');
            td.textContent = names[nameIndex] || '';
            td.classList.remove('highlight'); // Remove previous highlight
            tr.appendChild(td);
            nameIndex++;
        }
        table.appendChild(tr);
    }
}

function updateDepartmentContactTable(department) {
    const tableBody = document.querySelector('#department-contact-table tbody');
    tableBody.innerHTML = '';

    const rows = data[department];
    if (rows) {
        rows.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.contact}</td>
                <td>${row.email}</td>
                <td>${row.phone}</td>
                <td>${row.group}</td>
            `;
            tableBody.appendChild(tr);
        });
    }
}

function handleSearch() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    let foundMatch = false;

    // Search through departments and naming conventions
    for (let department in data) {
        const departmentData = data[department];

        // Check department contact information
        departmentData.forEach(row => {
            if (
                row.contact.toLowerCase().includes(searchTerm) ||
                row.email.toLowerCase().includes(searchTerm) ||
                row.phone.toLowerCase().includes(searchTerm) ||
                row.group.toLowerCase().includes(searchTerm)
            ) {
                showAndHighlight(department, 'contact-table', searchTerm);
                foundMatch = true;
            }
        });

        // Check naming conventions
        for (let category in namingConventions) {
            const names = namingConventions[category];
            names.forEach((name, index) => {
                if (name.toLowerCase().includes(searchTerm)) {
                    showAndHighlight(category, 'naming-convention-table', searchTerm, index);
                    foundMatch = true;
                }
            });
        }
    }

    if (!foundMatch) {
        alert('No matches found.');
    }
}

function showAndHighlight(categoryOrDepartment, tableType, searchTerm, nameIndex = null) {
    // Show the corresponding button
    const buttonsContainer = document.getElementById('button-container');
    const buttons = Array.from(buttonsContainer.getElementsByTagName('button'));
    const button = buttons.find(btn => btn.getAttribute('onclick').includes(categoryOrDepartment));
    if (button) {
        button.click(); // Trigger the button click to update the table
    }

    // Highlight the matching cell
    setTimeout(() => {
        if (tableType === 'naming-convention-table' && nameIndex !== null) {
            highlightNamingConventionCell(nameIndex, searchTerm);
        } else if (tableType === 'contact-table') {
            highlightContactTableCell(searchTerm);
        }
    }, 100); // Timeout to allow table to update
}

function highlightNamingConventionCell(nameIndex) {
    const table = document.getElementById('naming-convention-table').querySelector('tbody');
    const cells = Array.from(table.getElementsByTagName('td'));

    const cellToHighlight = cells[nameIndex];
    if (cellToHighlight) {
        cellToHighlight.classList.add('highlight');
    }
}

function highlightContactTableCell(searchTerm) {
    const table = document.getElementById('department-contact-table').querySelector('tbody');
    const rows = table.getElementsByTagName('tr');

    for (let row of rows) {
        Array.from(row.getElementsByTagName('td')).forEach(td => {
            if (td.textContent.toLowerCase().includes(searchTerm)) {
                td.classList.add('highlight');
            }
        });
    }
}

