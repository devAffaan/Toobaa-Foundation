window.onload = function() {
    if (document.getElementById('booksdiv')) {
        loadBooks();
    }
}

document.addEventListener('DOMContentLoaded', function() {

    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('open');
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('open');
            });
        });
    }
   const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchBooks();
            }
        });
    }

    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            searchBooks();
        });
    }

});

async function loadBooks() {
    try {
        const response = await fetch('/api/books');
        const books = await response.json();
        displayBooks(books);
    } catch (error) {
        console.error('Error loading books:', error);
    }
}

async function searchBooks() {
    const query = document.getElementById('searchInput').value.trim();

    if (query === '') {
        loadBooks();
        return;
    }

    try {
        const response = await fetch(`/api/books/search?q=${query}`);
        const books = await response.json();
        displayBooks(books);
    } catch (error) {
        console.error('Error searching:', error);
    }
}

function displayBooks(books) {
    const booksdiv = document.getElementById('booksdiv');

    if (!booksdiv) return;

    if (books.length === 0) {
        booksdiv.innerHTML = '<p style="padding:20px">No books found.</p>';
        return;
    }

    let html = '';
    books.forEach(book => {
        html += `
            <div class="bookcard">
                <img 
                    src="/static/${book.cover_image}" 
                    alt="${book.title}"
                    onerror="this.src='/static/images/default.png'">
                <h3 class="fh3">${book.title}</h3>
                <p class="author">Author: ${book.author}</p>
                <a href="/book/${book.id}">View Book</a>
            </div>
        `;
    });

async function filterBooks(category) {
    if (category === 'all') {
        loadBooks();
        return;
    }

    try {
        const response = await fetch(`/api/books/search?q=${category}`);
        const books = await response.json();
        displayBooks(books);
    } catch (error) {
        console.error('Error filtering:', error);
    }
}

    booksdiv.innerHTML = html;
}