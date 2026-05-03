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

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
        
            e.preventDefault();

            const name    = document.getElementById('contactName').value.trim();
            const phone   = document.getElementById('contactPhone').value.trim();
            const email   = document.getElementById('contactEmail').value.trim();
            const subject = document.getElementById('contactSubject').value.trim();
            const message = document.getElementById('contactMessage').value.trim();

            if (!name || !email || !message) {
                showMessage('Please fill name, email and message!', 'error');
                return;
            }

            
            const btn = contactForm.querySelector('.contactButton');
            btn.textContent = 'Sending...';
            btn.disabled = true;

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name, phone, email, subject, message
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    showMessage('Message sent successfully!', 'success');
                    contactForm.reset();
                } else {
                    showMessage(data.message || 'Error sending message!', 'error');
                }

            } catch (error) {
                showMessage('Something went wrong. Try again!', 'error');
            }

            btn.textContent = 'Send';
            btn.disabled = false;
        });
    }
});

function showMessage(message, type) {

    const existing = document.getElementById('formMessage');
    if (existing) existing.remove();

    const msg = document.createElement('p');
    msg.id = 'formMessage';
    msg.textContent = message;
    msg.style.marginTop = '10px';
    msg.style.fontWeight = '500';
    msg.style.color = type === 'success' ? 'green' : 'red';

    const form = document.getElementById('contactForm');
    form.appendChild(msg);

    setTimeout(() => msg.remove(), 4000);
}