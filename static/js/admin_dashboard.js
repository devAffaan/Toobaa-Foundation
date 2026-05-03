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
                <td colspan="6" class="no-books">
                    No books found. Add your first book!
                </td>
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
                    <button class="delete-btn" 
                            onclick="deleteBook(${book.id})">
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
    const description = document.getElementById('description').value;
    const coverFile   = document.getElementById('cover_image').files[0];
    const pdfFile     = document.getElementById('pdf_path').files[0];

    if (!title || !author || !category) {
        alert('Please fill title, author and category!');
        return;
    }

   
    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('category', category);
    formData.append('description', description);

    if (coverFile) {
        formData.append('cover_image', coverFile);
    }
    if (pdfFile) {
        formData.append('pdf_path', pdfFile);
    }


    const addBtn = document.getElementById('addBookBtn');
    addBtn.textContent = 'Adding...';
    addBtn.disabled = true;

    const response = await fetch('/api/admin/books', {
        method: 'POST',
        body: formData
        
    });

    addBtn.textContent = 'Add Book';
    addBtn.disabled = false;

    if (response.ok) {
        const modal = bootstrap.Modal.getInstance(
            document.getElementById('addBookModal')
        );
        modal.hide();

        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('category').value = '';
        document.getElementById('description').value = '';
        document.getElementById('cover_image').value = '';
        document.getElementById('pdf_path').value = '';


        loadBooks();
    } else {
        const data = await response.json();
        alert(data.message || 'Error adding book!');
    }
}


function previewImage(input) {
    const preview = document.getElementById('imagePreview');
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        }
        reader.readAsDataURL(input.files[0]);
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