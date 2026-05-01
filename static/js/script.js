window.onload = function() {
    loadBooks();
}

async function loadBooks() {
    const response = await fetch('/api/books');
    const books = await response.json();
    displayBooks(books);
}

async function searchBooks() {
    const query = document.getElementById('searchInput').value;
    
    if (query.trim() === '') {
        loadBooks();
        return;
    }

    const response = await fetch(`/api/books/search?q=${query}`);
    const books = await response.json();
    displayBooks(books);
}

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchBooks();
            }
        });
    }

    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
});

function displayBooks(books) {
    const booksdiv = document.getElementById('booksdiv');
    
    if (books.length === 0) {
        booksdiv.innerHTML = '<p>No books found.</p>';
        return;
    }

    let html = '';
    books.forEach(book => {
        html += `
            <div class="bookcard">
                <img src="/static/${book.cover_image}" 
                     alt="${book.title}"
                     onerror="this.src='/static/images/default.png'">
                <h3 class="fh3">${book.title}</h3>
                <p class="author">Author: ${book.author}</p>
                <a href="/book/${book.id}">View Book</a>
            </div>
        `;
    });

    booksdiv.innerHTML = html;
}