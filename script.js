
const questions = [
    {
        q: "1. What is the capital of India?",
        options: ["Mumbai", "New Delhi", "Chennai", "Hyderabad"],
        answer: 1
    },
    {
        q: "2. Which planet is called the Red Planet?",
        options: ["Earth", "Venus", "Mars", "Jupiter"],
        answer: 2
    },
    {
        q: "3. Which is the largest ocean?",
        options: ["Indian", "Atlantic", "Arctic", "Pacific"],
        answer: 3
    },
    {
        q: "4. Which language structures web pages?",
        options: ["HTML", "CSS", "SQL", "Python"],
        answer: 0
    },
    {
        q: "5. How many days are in a leap year?",
        options: ["364", "365", "366", "367"],
        answer: 2
    },
    {
        q: "6. Which gas do plants absorb?",
        options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"],
        answer: 1
    },
    {
        q: "7. What is 12 × 8?",
        options: ["84", "92", "96", "108"],
        answer: 2
    },
    {
        q: "8. Which device is used to type text?",
        options: ["Monitor", "Printer", "Keyboard", "Speaker"],
        answer: 2
    },
    {
        q: "9. Which is the largest mammal?",
        options: ["Elephant", "Blue whale", "Giraffe", "Shark"],
        answer: 1
    },
    {
        q: "10. What does CPU stand for?",
        options: [
            "Central Processing Unit",
            "Computer Personal Unit",
            "Central Program Utility",
            "Control Processing User"
        ],
        answer: 0
    }
];

let current = 0;
let answers = Array(10).fill(null);
let finalScore = 0;

const $ = id => document.getElementById(id);

function showPage(id) {
    document.querySelectorAll("main .card").forEach(card => {
        card.classList.add("hidden");
    });
    $(id).classList.remove("hidden");
}

function startQuiz() {
    current = 0;
    answers = Array(10).fill(null);
    showPage("quiz");
    displayQuestion();
}

function displayQuestion() {
    const q = questions[current];

    $("progress").textContent =
        `Question ${current + 1} of ${questions.length}`;

    $("question").textContent = q.q;
    $("options").innerHTML = "";

    q.options.forEach((option, index) => {
        const label = document.createElement("label");
        label.className = "option";

        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "answer";
        radio.checked = answers[current] === index;

        radio.addEventListener("change", () => {
            answers[current] = index;
        });

        label.appendChild(radio);
        label.appendChild(document.createTextNode(option));
        $("options").appendChild(label);
    });

    $("prevBtn").disabled = current === 0;
    $("nextBtn").classList.toggle("hidden", current === 9);
    $("finishBtn").classList.toggle("hidden", current !== 9);
}

function finishQuiz() {
    const unanswered = answers.filter(a => a === null).length;

    if (unanswered && !confirm(
        `You have ${unanswered} unanswered question(s). Submit anyway?`
    )) {
        return;
    }

    finalScore = questions.reduce((total, q, i) =>
        total + (answers[i] === q.answer ? 1 : 0), 0);

    $("score").textContent = `Your Score: ${finalScore} / 10`;
    $("percentage").textContent = `Percentage: ${finalScore * 10}%`;
    $("message").textContent =
        finalScore >= 7 ? "Great job!" : "Keep practising!";

    showPage("result");
}

function getUsers() {
    return JSON.parse(localStorage.getItem("quizUsers") || "{}");
}

function getResults() {
    return JSON.parse(localStorage.getItem("quizResults") || "{}");
}

function saveUsers(users) {
    localStorage.setItem("quizUsers", JSON.stringify(users));
}

function showLogin() {
    $("error").textContent = "";
    showPage("login");
}

function registerStudent() {
    const name = $("name").value.trim();
    const email = $("email").value.trim().toLowerCase();
    const password = $("password").value;

    if (!name || !email || !password) {
        $("error").textContent = "Please fill in all fields.";
        return;
    }

    if (password.length < 6) {
        $("error").textContent =
            "Password must contain at least 6 characters.";
        return;
    }

    const users = getUsers();

    if (users[email]) {
        $("error").textContent =
            "Email already registered. Please log in.";
        return;
    }

    users[email] = { name, password };
    saveUsers(users);
    saveResult(email);
}

function loginStudent() {
    const email = $("email").value.trim().toLowerCase();
    const password = $("password").value;
    const users = getUsers();

    if (!email || !password) {
        $("error").textContent = "Enter your email and password.";
        return;
    }

    if (!users[email] || users[email].password !== password) {
        $("error").textContent = "Invalid email or password.";
        return;
    }

    saveResult(email);
}

function saveResult(email) {
    const results = getResults();

    if (!results[email]) {
        results[email] = [];
    }

    results[email].push({
        score: finalScore,
        date: new Date().toLocaleString()
    });

    localStorage.setItem("quizResults", JSON.stringify(results));

    showDashboard(email);
}

function showDashboard(email) {
    const users = getUsers();
    const results = getResults();

    $("welcome").textContent =
        `Welcome, ${users[email].name}! Your result has been saved.`;

    $("history").innerHTML = "";

    (results[email] || []).forEach((result, index) => {
        const p = document.createElement("p");
        p.textContent =
            `Attempt ${index + 1}: ${result.score}/10 - ${result.date}`;
        $("history").appendChild(p);
    });

    localStorage.setItem("currentStudent", email);
    showPage("dashboard");
}

function logout() {
    localStorage.removeItem("currentStudent");
    showPage("home");
}

$("startBtn").addEventListener("click", startQuiz);

$("prevBtn").addEventListener("click", () => {
    if (current > 0) {
        current--;
        displayQuestion();
    }
});

$("nextBtn").addEventListener("click", () => {
    if (current < 9) {
        current++;
        displayQuestion();
    }
});

$("finishBtn").addEventListener("click", finishQuiz);
$("loginBtn").addEventListener("click", showLogin);
$("registerBtn").addEventListener("click", registerStudent);
$("loginSubmitBtn").addEventListener("click", loginStudent);

$("backBtn").addEventListener("click", () => showPage("result"));
$("retryBtn").addEventListener("click", () => showPage("home"));
$("logoutBtn").addEventListener("click", logout);
$("againBtn").addEventListener("click", startQuiz);
