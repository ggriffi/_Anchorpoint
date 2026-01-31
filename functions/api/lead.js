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

    // Detect preview vs production host
    const host = new URL(request.url).hostname;
    const isPreview = host.endsWith(".pages.dev"); // skip Turnstile on preview

    // Turnstile validation (enforce only on production/custom domain)
    if (!isPreview && env.TURNSTILE_SECRET_KEY) {
        const token = (form.get("cf-turnstile-response") || "").toString();

        if (!token) {
            return new Response("Turnstile failed: missing token (cf-turnstile-response).", { status: 403 });
        }

        const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
            method: "POST",
            headers: { "content-type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                secret: env.TURNSTILE_SECRET_KEY,
                response: token,
            }),
        }).then(r => r.json());

        if (!verify.success) {
            return new Response(
                `Turnstile failed. codes=${(verify["error-codes"] || []).join(",") || "none"} hostname=${verify.hostname || "n/a"} host=${host}`,
                { status: 403, headers: { "content-type": "text/plain" } }
            );
        }
    }

    // Save lead to KV (if bound)
    const lead = {
        id: crypto.randomUUID(),
        ts: new Date().toISOString(),
        name, email, phone, org, service, message,
        ua: request.headers.get("user-agent") || "",
        ip: request.headers.get("cf-connecting-ip") || "",
        host,
        preview: isPreview,
    };

    if (env.LEADS) {
        await env.LEADS.put(
            `lead:${lead.ts}:${lead.id}`,
            JSON.stringify(lead),
            { expirationTtl: 60 * 60 * 24 * 365 }
        );
    }

    // Email via Resend (do not block success if it fails)
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
Host: ${host}
IP: ${lead.ip}
UA: ${lead.ua}
`;

        try {
            const res = await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${env.RESEND_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    from: env.LEAD_FROM_EMAIL || "AnchorPoint IT <onboarding@resend.dev>",
                    to: [env.LEAD_TO_EMAIL],
                    subject,
                    text,
                    reply_to: email,
                }),
            });

            const bodyText = await res.text();
            console.log("Resend status:", res.status, bodyText);
        } catch (err) {
            console.log("Resend exception:", err?.message || String(err));
        }
    } else {
        console.log("Resend not configured: missing RESEND_API_KEY or LEAD_TO_EMAIL");
    }

    // Always redirect back to consult page with success flag
    return Response.redirect(new URL("/consult.html?sent=1", request.url).toString(), 303);
}
