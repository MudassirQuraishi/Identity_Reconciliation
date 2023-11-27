const form = document.getElementById("my-form");
const email = document.getElementById("email");
const phoneNumber = document.getElementById("phone-number");
const submitButton = document.getElementById("submit-button");

form.addEventListener("submit", placeOrder);

async function placeOrder(e) {
    e.preventDefault();
    try {
        const details = {
            email: email.value,
            phoneNumber: phoneNumber.value,
        };
        const valdiationCheck = formValidation(
            details.email,
            details.phoneNumber
        );
        console.log(valdiationCheck);
        if (valdiationCheck) {
            const response = await axios.post(
                "http://localhost:3000/api/identify",
                details
            );
            if (response) {
                alert("Form Submitted");
            }
            email.value = "";
            phoneNumber.value = "";
        }
    } catch (err) {
        console.log(err);
    }
}

function formValidation(email, phoneNumber) {
    const emailPattern = /^\S+@\S+\.\S+$/;
    const phonePattern = /^(\+\d{1,2})?\d{10}$/;
    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address");
        return false;
    }
    if (!phonePattern.test(phoneNumber)) {
        alert("Please enter a valid phone number");
        return false;
    }
    return true;
}
