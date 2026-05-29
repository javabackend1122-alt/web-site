document.getElementById('feedbackForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const type = document.getElementById('messageType').value;
    const message = document.getElementById('userMessage').value.trim();
    
    const currentDate = new Date();
    const formattedTime = currentDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const formattedDate = currentDate.toLocaleDateString('az-AZ');

    const newTicket = {
        ticketId: "TCK-" + Math.floor(100000 + Math.random() * 900000),
        senderName: name,
        senderEmail: email,
        requestType: type,
        content: message,
        date: formattedDate,
        time: formattedTime,
        status: "Gözləmədə"
    };

    let allTickets = JSON.parse(localStorage.getItem('portal_tickets')) || [];
    allTickets.unshift(newTicket);
    localStorage.setItem('portal_tickets', JSON.stringify(allTickets));

    const badgeNotif = {
        id: "NOTIF-" + Math.floor(Math.random() * 100000),
        message: `Yeni Müraciət daxil oldu: ${name} (${type.toUpperCase()})`,
        type: 'sistem',
        time: formattedTime
    };
    localStorage.setItem('portal_global_notification', JSON.stringify(badgeNotif));

    document.getElementById('feedbackForm').reset();
    const successBox = document.getElementById('formSuccess');
    successBox.style.display = 'flex';

    setTimeout(() => {
        successBox.style.display = 'none';
    }, 4000);
});