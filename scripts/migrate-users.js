const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.resolve(process.cwd(), ".env.local") });

const { sql, ensureUsersTable } = require("../lib/database");

async function migrateUsers() {
    if (!sql) {
        throw new Error("Set DATABASE_URL in .env.local before running this migration.");
    }

    const sourceFile = path.resolve(process.argv[2] || "users.json");
    const users = JSON.parse(fs.readFileSync(sourceFile, "utf8"));

    if (!Array.isArray(users)) {
        throw new Error("The source user file must contain a JSON array.");
    }

    await ensureUsersTable();

    let imported = 0;
    for (const user of users) {
        if (!user.id || !user.name || !user.email || !user.passwordHash) {
            throw new Error("A source user record is missing a required field.");
        }

        const email = String(user.email).trim().toLowerCase();
        const createdAt = user.createdAt || new Date().toISOString();
        const inserted = await sql`
            INSERT INTO users (id, name, email, password_hash, created_at)
            VALUES (${String(user.id)}, ${String(user.name).trim()}, ${email}, ${user.passwordHash}, ${createdAt})
            ON CONFLICT (email) DO NOTHING
            RETURNING id
        `;
        imported += inserted.length;
    }

    await sql`
        SELECT setval(
            pg_get_serial_sequence('users', 'id'),
            COALESCE((SELECT MAX(id) FROM users), 1),
            EXISTS (SELECT 1 FROM users)
        )
    `;

    console.log(`Imported ${imported} new account(s); existing email addresses were skipped.`);
}

migrateUsers().catch(error => {
    console.error("User migration failed:", error.message);
    process.exitCode = 1;
});