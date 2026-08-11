const API_URL = "http://localhost:5000/api/issues";

async function loadIssues() {
    const tableBody = document.getElementById("issuesTableBody");
    const issueSelect = document.getElementById("issueSelect");

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to load issued books");
        }

        const issues = await response.json();

        tableBody.innerHTML = "";

        issueSelect.innerHTML = `
            <option value="">
                -- Select Issued Book --
            </option>
        `;

        const issuedBooks = issues.filter(
            issue => issue.status === "Issued"
        );

        if (issuedBooks.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="4">
                        No books are currently issued.
                    </td>
                </tr>
            `;
            return;
        }

        issuedBooks.forEach(issue => {

            const studentName =
                issue.studentId?.name || "Unknown Student";

            const bookTitle =
                issue.bookId?.title || "Unknown Book";

            const issueDate =
                issue.issueDate
                    ? new Date(issue.issueDate).toLocaleDateString()
                    : "-";

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${studentName}</td>
                <td>${bookTitle}</td>
                <td>${issueDate}</td>
                <td>${issue.status}</td>
            `;

            tableBody.appendChild(row);

            const option = document.createElement("option");

            option.value = issue._id;
            option.textContent =
                `${studentName} - ${bookTitle}`;

            issueSelect.appendChild(option);
        });

    } catch (error) {

        console.error("Error loading issued books:", error);

        tableBody.innerHTML = `
            <tr>
                <td colspan="4">
                    ❌ Unable to load issued books.
                </td>
            </tr>
        `;
    }
}


async function returnBook() {

    const issueSelect =
        document.getElementById("issueSelect");

    const message =
        document.getElementById("message");

    const issueId =
        issueSelect.value;

    if (!issueId) {

        message.textContent =
            "⚠️ Please select an issued book.";

        message.style.color = "red";

        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/${issueId}/return`,
            {
                method: "PUT"
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to return book"
            );
        }

        message.textContent =
            "✅ Book returned successfully!";

        message.style.color = "green";

        issueSelect.value = "";

        loadIssues();

    } catch (error) {

        console.error(error);

        message.textContent =
            "❌ " + error.message;

        message.style.color = "red";
    }
}


document.addEventListener(
    "DOMContentLoaded",
    loadIssues
);