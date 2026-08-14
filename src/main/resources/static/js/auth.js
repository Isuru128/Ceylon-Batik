window.CBAuth = {

    register: async function(data) {

        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            // Backend may return a plain string or a JSON object for errors
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

        return await response.json();
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
            // Backend may return a plain string or a JSON object for errors
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

        return await response.json();
    }
};