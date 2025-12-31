function register() {
    let name = document.getElementById("regName").value.trim();
    let email = document.getElementById("regEmail").value.trim();
    let password = document.getElementById("regPassword").value.trim();
    let msg = document.getElementById("msg");

    if (name === "" || email === "" || password === "") {
        msg.textContent = "Vui lòng nhập đầy đủ thông tin!";
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.some(u => u.email === email)) {
        msg.textContent = "Email đã tồn tại!";
        return;
    }

    users.push({ name, email, password });
    localStorage.setItem("users", JSON.stringify(users));
    msg.textContent = "Đăng ký thành công! Chuyển hướng...";
    
    setTimeout(() => {
        window.location.href = "login.html";
    }, 1000);
}
