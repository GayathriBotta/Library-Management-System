const API_URL = "http://localhost:5000/api/students";


// ==============================
// LOAD STUDENTS
// ==============================

async function loadStudents() {

    const tableBody =
        document.getElementById("studentsTableBody");

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to load students");
        }

        const students = await response.json();

        tableBody.innerHTML = "";

        if (students.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="7">
                        No students found.
                    </td>
                </tr>
            `;

            return;
        }

        students.forEach(student => {

            const row = document.createElement("tr");

            row.innerHTML = `

                <td>${student.studentId}</td>

                <td>${student.name}</td>

                <td>${student.email}</td>

                <td>${student.phone}</td>

                <td>${student.department}</td>

                <td>${student.year}</td>

                <td>

                    <button
                        class="delete-btn"
                        onclick="deleteStudent('${student._id}')">

                        🗑️ Delete

                    </button>

                </td>

            `;

            tableBody.appendChild(row);

        });

    } catch (error) {

        console.error("Error loading students:", error);

        tableBody.innerHTML = `
            <tr>
                <td colspan="7">
                    ❌ Unable to load students.
                </td>
            </tr>
        `;
    }
}



// ==============================
// ADD STUDENT
// ==============================

document
    .getElementById("studentForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();

        const message =
            document.getElementById("message");


        const student = {

            studentId:
                document.getElementById("studentId").value,

            name:
                document.getElementById("name").value,

            email:
                document.getElementById("email").value,

            phone:
                document.getElementById("phone").value,

            department:
                document.getElementById("department").value,

            year:
                Number(
                    document.getElementById("year").value
                )

        };


        try {

            const response = await fetch(API_URL, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(student)

            });


            const data = await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message || "Failed to add student"
                );

            }


            message.textContent =
                "✅ Student added successfully!";

            message.style.color = "green";


            document
                .getElementById("studentForm")
                .reset();


            loadStudents();


        } catch (error) {

            console.error(error);

            message.textContent =
                "❌ " + error.message;

            message.style.color = "red";

        }

    });



// ==============================
// DELETE STUDENT
// ==============================

async function deleteStudent(id) {

    if (!confirm(
        "Are you sure you want to delete this student?"
    )) {
        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/${id}`,
            {
                method: "DELETE"
            }
        );


        if (!response.ok) {

            const data = await response.json();

            throw new Error(
                data.message || "Failed to delete student"
            );

        }


        loadStudents();


    } catch (error) {

        console.error(error);

        alert("❌ " + error.message);

    }

}



// ==============================
// LOAD WHEN PAGE OPENS
// ==============================

document.addEventListener(
    "DOMContentLoaded",
    loadStudents
);