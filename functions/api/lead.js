export async function onRequestPost(context) {
    const { request, env } = context;

    // Parse form
    const form = await request.formData();
    const name = (form.get("name") || "").toString().trim();
    const email = (form.get("email") || "").toString().trim();
    const phone = (form.get("phone") || "").toString().trim();
    const org = (form.get("org") || "").toString().trim();
    const service = (form.get("service") || "").toString().trim();
    const message = (form.get("message") || "").toString().trim();

    // Basic validation
    if (!name || !email || !service || !message) {
        return new Response("Missing required fields.", { status: 400 });
    }

    // (Recommended) Turnstile validation
    const token = (form.get("cf-turnstile-response") || "").toString();
    if (env.TURNSTILE_SECRET_KEY) {
        const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
            method: "POST",
            headers: { "content-type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                secret: env.TURNSTILE_SECRET_KEY,
                response: token,
                // optional: remoteip (not necessary in most cases)
            }),
        }).then(r => r.json());

        if (!verify.success) {
            return new Response(
                `Turnstile failed. codes=${(verify["error-codes"] || []).join(",")}`,
                { status: 403, headers: { "content-type": "text/plain" } }
            );
        }


        // Save lead to KV (if bound)
        const lead = {
            id: crypto.randomUUID(),
            ts: new Date().toISOString(),
            name, email, phone, org, service, message,
            ua: request.headers.get("user-agent") || "",
            ip: request.headers.get("cf-connecting-ip") || "",
        };

        if (env.LEADS) {
            await env.LEADS.put(`lead:${lead.ts}:${lead.id}`, JSON.stringify(lead), { expirationTtl: 60 * 60 * 24 * 365 });
        }

        // Email via Resend (recommended + official tutorial exists)
        if (env.RESEND_API_KEY && env.LEAD_TO_EMAIL) {
            const subject = `New consult request: ${service} — ${name}`;
            const text =
                `New consult request

Name: ${name}
Email: ${email}
Phone: ${phone || "-"}
Org: ${org || "-"}
Service: ${service}

Message:
${message}

Timestamp: ${lead.ts}
IP: ${lead.ip}
UA: ${lead.ua}
`;

            await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${env.RESEND_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    from: env.LEAD_FROM_EMAIL || "leads@anchorpoint-it.com",
                    to: [env.LEAD_TO_EMAIL],
                    subject,
                    text,
                    reply_to: email,
                }),
            });
        }

        // Redirect back to consult page with success flag
        return Response.redirect(new URL("/consult.html?sent=1", request.url).toString(), 303);
    }
