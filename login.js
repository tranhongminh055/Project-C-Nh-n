function login() {
    let email = document.getElementById("loginEmail").value.trim();
    let password = document.getElementById("loginPassword").value.trim();
    let msg = document.getElementById("msg");

    if (email === "" || password === "") {
        msg.textContent = "Vui lòng nhập đầy đủ!";
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let userFound = users.find(u => u.email === email && u.password === password);

    if (userFound) {
        // Merge any existing `loggedUser` extra fields (avatar, address, bank info, fullName etc.)
        try {
            const existing = JSON.parse(localStorage.getItem('loggedUser')) || JSON.parse(localStorage.getItem('loggedInUser'));
            if (existing && existing.email && existing.email.toString().trim().toLowerCase() === userFound.email.toString().trim().toLowerCase()) {
                // copy only non-empty extra fields
                const extras = ['avatar','address','bankName','bankNumber','fullName','name','gender','birthday'];
                extras.forEach(k => {
                    if (existing[k] !== undefined && existing[k] !== null && existing[k] !== '') {
                        userFound[k] = existing[k];
                    }
                });
                // update users array so changes persist
                try {
                    const users = JSON.parse(localStorage.getItem('users')) || [];
                    const idx = users.findIndex(u => (u.email||'').toString().trim().toLowerCase() === userFound.email.toString().trim().toLowerCase());
                    if (idx >= 0) { users[idx] = Object.assign({}, users[idx], userFound); }
                    else { users.push(userFound); }
                    localStorage.setItem('users', JSON.stringify(users));
                } catch (e) { /* ignore */ }
            }
        } catch (e) { /* ignore */ }

        localStorage.setItem("loggedUser", JSON.stringify(userFound));
        window.location.href = "index.html";
    } else {
        msg.textContent = "Sai email hoặc mật khẩu!";
    }
}
