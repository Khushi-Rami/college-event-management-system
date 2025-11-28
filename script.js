// --- Switch Login/Register ---
function showRegister() {
    document.getElementById("loginBox").classList.add("hidden");
    document.getElementById("registerBox").classList.remove("hidden");
}

function showLogin() {
    document.getElementById("registerBox").classList.add("hidden");
    document.getElementById("loginBox").classList.remove("hidden");
}

// --- Register User ---
function register() {
    let user = {
        name: document.getElementById("regName").value,
        email: document.getElementById("regEmail").value,
        pass: document.getElementById("regPass").value
    };
    if (!user.name || !user.email || !user.pass) {
        alert("All fields required!");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.some(u => u.email === user.email)) {
        alert("Email already registered!");
        return;
    }

    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
    alert("Registration Successful!");
    showLogin();
}

// --- Login User/Admin ---
function login() {
    let email = document.getElementById("loginEmail").value;
    let pass = document.getElementById("loginPass").value;

    // Admin credentials
    if (email === "admin@gmail.com" && pass === "admin123") {
        window.location.href = "admin.html";
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    let user = users.find(u => u.email === email && u.pass === pass);

    if (user) {
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        window.location.href = "user.html"; // redirect to user page
    } else {
        alert("Invalid Credentials");
    }
}

// --- Logout ---
function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
}

// --- Add Event (Admin) ---
function addEvent() {
    let title = document.getElementById("eventTitle").value;
    let date = document.getElementById("eventDate").value;
    let category = document.getElementById("eventCategory").value;
    let desc = document.getElementById("eventDesc").value;

    if (!title || !date || !desc) {
        alert("All fields required!");
        return;
    }

    let event = { title, date, category, desc };
    let events = JSON.parse(localStorage.getItem("events")) || [];
    events.push(event);

    localStorage.setItem("events", JSON.stringify(events));
    alert("Event Added!");
    displayEvents();
}

// --- Show Events (Admin) ---
function displayEvents() {
    if (!document.getElementById("eventList")) return;

    let events = JSON.parse(localStorage.getItem("events")) || [];
    let html = "";

    events.forEach((ev, index) => {
        html += `
        <div class="eventCard">
            <b>${ev.title}</b> (${ev.category}) <br>
            📅 ${ev.date} <br>
            ${ev.desc}<br>
            <button onclick="deleteEvent(${index})">Delete</button>
        </div>`;
    });

    document.getElementById("eventList").innerHTML = html;
}
displayEvents();

// --- Delete Event ---
function deleteEvent(index) {
    let events = JSON.parse(localStorage.getItem("events")) || [];
    events.splice(index, 1);
    localStorage.setItem("events", JSON.stringify(events));
    displayEvents();
}

// --- USER: Search, Filter & Display Events ---
function displayUserEvents() {
    if (!document.getElementById("userEventList")) return;

    let events = JSON.parse(localStorage.getItem("events")) || [];
    let search = document.getElementById("searchEvent")?.value.toLowerCase() || "";
    let filter = document.getElementById("filterCategory")?.value || "All";

    let html = "";

    events.forEach((ev, index) => {
        if (!ev.title.toLowerCase().includes(search)) return;
        if (filter !== "All" && ev.category !== filter) return;

        html += `
        <div class="eventCard">
            <b>${ev.title}</b> (${ev.category}) <br>
            📅 ${ev.date}<br>
            ${ev.desc}<br>
            <button onclick="bookEvent(${index})">Book Event</button>
        </div>`;
    });

    document.getElementById("userEventList").innerHTML = html;
}

// --- Book Event & Show Participation Form ---
function bookEvent(index) {
    let events = JSON.parse(localStorage.getItem("events")) || [];
    let bookedEvents = JSON.parse(localStorage.getItem("bookedEvents")) || [];
    let loggedUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!loggedUser) {
        alert("Please login first!");
        return;
    }

    // Add event to bookedEvents
    bookedEvents.push({ ...events[index], userEmail: loggedUser.email });
    localStorage.setItem("bookedEvents", JSON.stringify(bookedEvents));

    // Show participation registration form
    document.getElementById("participationForm").classList.remove("hidden");
    alert("Event booked! Please complete participation registration.");
}

// --- Submit Participation Registration ---
function submitParticipation() {
    let roll = document.getElementById("rollNumber").value;
    let branch = document.getElementById("branch").value;
    let year = document.getElementById("yearParticipation").value;

    if (!roll || !branch || !year) {
        alert("All fields are required!");
        return;
    }

    let loggedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    let participation = JSON.parse(localStorage.getItem("participation")) || [];

    participation.push({
        email: loggedUser.email,
        name: loggedUser.name,
        roll,
        branch,
        year,
        timestamp: new Date().toLocaleString()
    });

    localStorage.setItem("participation", JSON.stringify(participation));
    alert("Participation registration successful!");
    document.getElementById("participationForm").classList.add("hidden");

    // Clear form fields
    document.getElementById("rollNumber").value = "";
    document.getElementById("branch").value = "";
    document.getElementById("yearParticipation").value = "";
}


// --- Open Contact Form ---
function openContactForm() {
    document.getElementById("contactForm").classList.remove("hidden");
}

// --- Close Contact Form ---
function closeContactForm() {
    document.getElementById("contactForm").classList.add("hidden");
}

// --- Submit Contact Form ---
function submitContact() {
    let name = document.getElementById("contactName").value;
    let email = document.getElementById("contactEmail").value;
    let message = document.getElementById("contactMessage").value;

    if (!name || !email || !message) {
        alert("All fields are required!");
        return;
    }

    // Save contact messages in localStorage
    let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
    contacts.push({ name, email, message, time: new Date().toLocaleString() });
    localStorage.setItem("contacts", JSON.stringify(contacts));

    alert("Message sent successfully!");
    closeContactForm();

    // Clear form
    document.getElementById("contactName").value = "";
    document.getElementById("contactEmail").value = "";
    document.getElementById("contactMessage").value = "";
}


// Admin: View all student registrations for events
function viewRegistrations() {
    let booked = JSON.parse(localStorage.getItem("bookedEvents")) || [];
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let html = "";

    if (booked.length === 0) {
        html = "<p>No students have registered for any event yet.</p>";
    } else {
        booked.forEach((event, index) => {
            html += `<div class="eventCard">
                        <b>Event:</b> ${event.title} (${event.category})<br>
                        📅 ${event.date}<br>
                        <b>Description:</b> ${event.desc}<br>
                        <b>Student Name:</b> ${event.studentName || "Unknown"}<br>
                        <b>Email:</b> ${event.studentEmail || "Unknown"}<br>
                        <b>Roll No:</b> ${event.studentRoll || "Unknown"}<br>
                        <b>Year:</b> ${event.studentYear || "Unknown"}<br>
                        <b>Branch:</b> ${event.studentBranch || "Unknown"}
                     </div>`;
        });
    }

    document.getElementById("registrationList").innerHTML = html;
}

