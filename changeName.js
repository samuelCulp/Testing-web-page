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
    const buttonsContainer = document.getElementById('buttons-container');
    const buttons = buttonsContainer.getElementsByTagName('button');

    // Hide all buttons initially
    for (let button of buttons) {
        button.style.display = 'none';
    }

    // Search through departments and show relevant buttons
    for (let department in data) {
        const departmentData = data[department];
        const isMatch = departmentData.some(row => {
            return (
                row.contact.toLowerCase().includes(searchTerm) ||
                row.email.toLowerCase().includes(searchTerm) ||
                row.phone.toLowerCase().includes(searchTerm) ||
                row.group.toLowerCase().includes(searchTerm)
            );
        });

        if (isMatch) {
            // Show the corresponding button if there's a match
            const button = Array.from(buttons).find(btn => btn.getAttribute('onclick').includes(department));
            if (button) {
                button.style.display = '';
            }
        }
    }
}
