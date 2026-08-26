window.CBAuth = {

    getToken: function() {
        try {
            const user = JSON.parse(localStorage.getItem("user") || "null");
            if (user && user.token) return user.token;
            const admin = JSON.parse(localStorage.getItem("adminUser") || "null");
            if (admin && admin.token) return admin.token;
        } catch {}
        return null;
    },

    getAuthHeaders: function(customHeaders = {}) {
        const headers = {
            "Content-Type": "application/json",
            ...customHeaders
        };
        const token = this.getToken();
        if (token) {
            headers["Authorization"] = "Bearer " + token;
        }
        return headers;
    },

    register: async function(data) {

        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const text = await response.text();
            let message;
            try {
                const parsed = JSON.parse(text);
                message = parsed.message || parsed.error || text;
            } catch {
                message = text || "Registration failed. Please try again.";
            }
            throw new Error(message);
        }

        const result = await response.json();
        if (result && result.token) {
            localStorage.setItem("user", JSON.stringify(result));
        }
        return result;
    },

    login: async function(contact, password) {

        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contact,
                password
            })
        });

        if (!response.ok) {
            const text = await response.text();
            let message;
            try {
                const parsed = JSON.parse(text);
                message = parsed.message || parsed.error || text;
            } catch {
                message = text || "Login failed. Please try again.";
            }
            throw new Error(message);
        }

        const result = await response.json();
        if (result && result.token) {
            localStorage.setItem("user", JSON.stringify(result));
        }
        return result;
    },

    adminLogin: async function(contact, password) {

        const response = await fetch("/api/admin/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contact,
                password
            })
        });

        if (!response.ok) {
            const text = await response.text();
            let message;
            try {
                const parsed = JSON.parse(text);
                message = parsed.message || parsed.error || text;
            } catch {
                message = text || "Admin authentication failed.";
            }
            throw new Error(message);
        }

        const result = await response.json();
        if (result && result.token) {
            localStorage.setItem("adminUser", JSON.stringify(result));
        }
        return result;
    }
};