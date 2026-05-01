window.onload = function() {
    loadBooks();
}

async function loadBooks() {
    const response = await fetch('/api/books');
    const books = await response.json();

    document.getElementById('totalBooks').textContent = books.length;

    const tableBody = document.getElementById('booksTable');

    if (books.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="no-books">No books found!</td>
            </tr>
        `;
        return;
    }

    let rows = '';
    books.forEach(book => {
        rows += `
            <tr>
                <td>${book.id}</td>
                <td>
                    <img src="/static/${book.cover_image}"
                         class="book-cover"
                         onerror="this.src='/static/images/default.png'">
                </td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.category}</td>
                <td>
                    <button class="delete-btn" onclick="deleteBook(${book.id})">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });

    tableBody.innerHTML = rows;
}

async function addBook() {
    const title       = document.getElementById('title').value;
    const author      = document.getElementById('author').value;
    const category    = document.getElementById('category').value;
    const cover_image = document.getElementById('cover_image').value;
    const pdf_path    = document.getElementById('pdf_path').value;
    const description = document.getElementById('description').value;

    if (!title || !author || !category) {
        alert('Please fill title, author and category!');
        return;
    }

    const response = await fetch('/api/admin/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title, author, category,
            cover_image, pdf_path, description
        })
    });

    if (response.ok) {
        const modal = bootstrap.Modal.getInstance(
            document.getElementById('addBookModal')
        );
        modal.hide();

        // clear form fields
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('category').value = '';
        document.getElementById('cover_image').value = '';
        document.getElementById('pdf_path').value = '';
        document.getElementById('description').value = '';

        loadBooks();
    } else {
        alert('Error adding book!');
    }
}

async function deleteBook(bookId) {
    if (!confirm('Are you sure you want to delete this book?')) {
        return;
    }

    const response = await fetch(`/api/admin/books/${bookId}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        loadBooks();
    } else {
        alert('Error deleting book!');
    }
}

async function logout() {
    const response = await fetch('/api/admin/logout', {
        method: 'POST'
    });

    if (response.ok) {
        window.location.href = '/admin/login';
    }
}