const contactForm = document.getElementById('contactForm')
const messageSection = document.getElementById('messages')
async function fetchMessages(){
    try {
        const response = await fetch('/api/contact/message')
        const messages = await response.json()

        messageSection.innerHTML = ''

        messages.forEach(msg => {
            const card = document.createElement('div');
            card.classList.add('message-card');

            let formattedDate;
            if (msg.timestamp) {
                const dateObj = msg.timestamp._seconds
                    ? new Date(msg.timestamp._seconds * 1000)
                    : new Date(msg.timestamp);

                formattedDate = dateObj.toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }

            card.innerHTML = `
        <div class="message-header">
            <strong class="user-name">${msg.name }</strong>
            <span class="message-date">${formattedDate}</span>
        </div>
        <p class="message-text">${msg.message || ''}</p>
    `;

            messageSection.appendChild(card);
        })
    }catch (e) {
        messageSection.innerHTML = '<p>Error loading messages.</p>';
    }
}

contactForm.addEventListener('submit' , async (e)=>{
    e.preventDefault()

    const formData = {
        name: document.getElementById('contact_name').value,
        email: document.getElementById('contact_email').value,
        message: document.getElementById('contact_message').value
    };

    try {
        const response = await fetch('/api/contact',{
            method:'POST',
            headers : {'content-Type' : 'application/json'},
            body : JSON.stringify(formData)
        })

        console.log(response)

        if (response.ok) {
            alert('Message sent successfully!');
            contactForm.reset();
        } else {
            alert('Failed to send message.');
        }
        fetchMessages()
    }catch (e){
        console.error('Error submitting form:', error);
    }
})

 fetchMessages()