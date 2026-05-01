const bookId = window.location.pathname.split('/').pop();

async function loadBook() {
    const response = await fetch(`/api/books/${bookId}`);
    
    if (!response.ok) {
        document.querySelector('.bookDetailsection').innerHTML = 
            '<p style="text-align:center;padding:50px">Book not found!</p>';
        return;
    }

    const book = await response.json();

    document.getElementById('bookImg').src = `/static/${book.cover_image}`;
    document.getElementById('bookImg').alt = book.title;
    document.getElementById('bookTitle').textContent = book.title;
    document.getElementById('bookAuthor').textContent = book.author;
    document.getElementById('bookCategory').textContent = book.category;
    document.getElementById('bookDescription').textContent = 
        book.description || 'No description available.';

    document.getElementById('viewBtn').href = `/api/books/view/${book.id}`;
    document.getElementById('downloadBtn').href = `/api/books/download/${book.id}`;
    document.getElementById('downloadBtn').setAttribute('download', book.title);

    document.title = `${book.title} - Tooba Foundation`;
}

loadBook();

document.getElementById('hamburger').addEventListener('click', function() {
    document.getElementById('navMenu').classList.toggle('active');
});