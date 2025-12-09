// ... (Your existing JavaScript code before handleCreateEvent)

// Create Event
async function handleCreateEvent(e) {
    e.preventDefault();
    const eventData = {
        title: document.getElementById('eventTitle').value,
        category: document.getElementById('eventCategory').value,
        subCategory: document.getElementById('eventSubCategory').value,
        postedBy: document.getElementById('eventPostedBy').value,
        venue: document.getElementById('eventVenue').value,
        start: document.getElementById('eventStart').value,
        end: document.getElementById('eventEnd').value,
        description: document.getElementById('eventDescription').value,
        notifyHours: parseInt(document.getElementById('notifyHours').value),
        // -----------------------------------------------------------------
        // 👇 COMPLETED CODE BLOCK STARTS HERE 👇
        // -----------------------------------------------------------------
        approved: document.getElementById('markApproved').checked && userRole === 'Admin' || document.getElementById('eventPostedBy').value === 'Admin',
        rsvpCount: 0,
        likeCount: 0,
        createdAt: new Date().toISOString()
    };

    try {
        // In a real app, this would use the Firebase Firestore instance 'db'
        // await db.collection('events').add(eventData);
        
        // Use a simple ID generation for demo purposes
        eventData.id = 'temp_' + Date.now();
        events.unshift(eventData); // Add to the beginning of the local list

        hideEventModal();
        await loadEvents(); // Reload/re-render events from the updated local array
        alert(`Event "${eventData.title}" submitted. Status: ${eventData.approved ? 'Approved' : 'Pending Review'}`);

    } catch (error) {
        console.error("Error creating event:", error);
        alert("Failed to create event. See console for details.");
    }
}

// Admin/Moderator Action
async function approveEvent(eventId) {
    if (userRole !== 'Admin') {
        alert('Permission denied. Only Admins can approve events.');
        return;
    }

    const eventIndex = events.findIndex(e => e.id === eventId);
    if (eventIndex > -1) {
        events[eventIndex].approved = true;
        // In a real app, update Firebase: await db.collection('events').doc(eventId).update({ approved: true });
        renderEvents();
        updateStats();
        alert(`Event ID ${eventId} approved.`);
    }
}

// Admin Action
async function deleteEvent(eventId) {
    if (userRole !== 'Admin' && userRole !== 'Faculty Moderator') {
        alert('Permission denied. Only Admins/Moderators can delete events.');
        return;
    }

    if (confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
        const initialLength = events.length;
        events = events.filter(e => e.id !== eventId);
        if (events.length < initialLength) {
            // In a real app, delete from Firebase: await db.collection('events').doc(eventId).delete();
            renderEvents();
            updateStats();
            alert(`Event ID ${eventId} deleted.`);
        }
    }
}

// User Action
function toggleRSVP(eventId) {
    const eventIndex = events.findIndex(e => e.id === eventId);
    if (eventIndex > -1) {
        const event = events[eventIndex];
        // Simple toggle for demo
        const isGoing = Math.random() > 0.5; // Simulate a true/false user RSVP status
        
        if (isGoing) {
             event.rsvpCount = (event.rsvpCount || 0) + 1;
             alert(`You are now RSVP'd for "${event.title}"!`);
        } else {
             event.rsvpCount = Math.max(0, (event.rsvpCount || 0) - 1);
             alert(`RSVP removed for "${event.title}".`);
        }
       
        // In a real app, you would update the Firebase counter and the user's RSVP status
        renderEvents();
    }
}

// Utility Function for Calendar Link
function makeGoogleCalendarLink(event) {
    const startISO = new Date(event.start).toISOString().replace(/-|:|\.\d{3}/g, '');
    const endISO = new Date(event.end).toISOString().replace(/-|:|\.\d{3}/g, '');
    const details = `Posted by: ${event.postedBy}%0A%0A${event.description}`;
    return `http://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startISO}/${endISO}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(event.venue)}`;
}

// Render available clubs/postedBy options in the filter
function renderFilters() {
    const clubFilter = document.getElementById('clubFilter');
    const postedBySelect = document.getElementById('eventPostedBy');
    
    // Collect all unique posters from demo data and modal options
    const uniquePosters = new Set([
        ...events.map(e => e.postedBy),
        ...Array.from(postedBySelect.options).map(o => o.value)
    ]);
    
    // Clear and repopulate the filter dropdown
    clubFilter.innerHTML = '<option value="">All Clubs</option>';
    uniquePosters.forEach(club => {
        if (club && club !== 'Student') {
            const option = document.createElement('option');
            option.value = club;
            option.textContent = club;
            clubFilter.appendChild(option);
        }
    });
}

// Render Calendar View
function renderCalendar() {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sunday, 1 = Monday
    const grid = document.getElementById('calendarGrid');
    grid.innerHTML = '';
    
    // Day Headers (Sun-Sat)
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayNames.forEach(day => {
        grid.innerHTML += `<div class="calendar-header">${day}</div>`;
    });

    // Padding for days before the 1st
    for (let i = 0; i < firstDay; i++) {
        grid.innerHTML += `<div class="calendar-day" style="opacity:0.5;"></div>`;
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = `${currentYear}-${currentMonth + 1}-${day}`;
        const dayEvents = events.filter(e => {
            const eventDate = new Date(e.start);
            return eventDate.getDate() === day && 
                   eventDate.getMonth() === currentMonth && 
                   eventDate.getFullYear() === currentYear &&
                   e.approved; // Only show approved events on the calendar
        });

        const dayClasses = ['calendar-day'];
        if (dayEvents.length > 0) {
            dayClasses.push('has-events');
        }
        if (day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
            dayClasses.push('pulse'); // Highlight today
        }

        grid.innerHTML += `
            <div class="${dayClasses.join(' ')}" title="${dayEvents.map(e => e.title).join(', ')}">
                <div class="day-number">${day}</div>
                <div class="day-events">${dayEvents.length > 0 ? `${dayEvents.length} Events` : ''}</div>
            </div>
        `;
    }
}

// Placeholder for notification settings update (e.g., saving to user profile)
function renderNotifications() {
    document.querySelectorAll('.toggle-switch').forEach(switchEl => {
        switchEl.onclick = function() {
            this.classList.toggle('checked');
            const setting = this.dataset.setting;
            const isChecked = this.classList.contains('checked');
            console.log(`Notification setting for ${setting} updated to: ${isChecked}`);
            // In a real app, save this preference to user profile in Firebase Auth or Firestore
        };
    });
}

// Update switchView to render the calendar
function switchView(view) {
    currentView = view;
    document.querySelectorAll('.nav-tab').forEach(nav => nav.classList.remove('active'));
    document.querySelector(`#nav${view.charAt(0).toUpperCase() + view.slice(1)}`).classList.add('active');
    
    document.getElementById('listView').classList.toggle('hidden', view !== 'list');
    document.getElementById('calendarView').classList.toggle('hidden', view !== 'calendar');
    document.getElementById('analyticsView').classList.toggle('hidden', view !== 'analytics');

    if (view === 'calendar') {
        renderCalendar();
    }
}

// Update init to include renderCalendar
async function init() {
    setupEventListeners();
    await loadEvents();
    updateStats();
    renderFilters();
    renderNotifications();
    setDefaultFormDates();
    renderCalendar(); // Render the calendar initially (hidden, but ready)
}
// -----------------------------------------------------------------
// 👆 COMPLETED CODE BLOCK ENDS HERE 👆
// -----------------------------------------------------------------

// Start the application
init();