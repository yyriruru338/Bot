const { Client, GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder, MessageFlags, ChannelType, PermissionFlagsBits } = require('discord.js');
const QRCode = require('qrcode');
const { createCanvas, loadImage } = require('canvas');
const sqlite3 = require('sqlite3');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const setupTower = require('./towermodule.js');

const PREFIX = '.';
const APIRONEWALLETID = 'your_wallet_id_here';
const APIRONETRANSFERKEY = 'your_transfer_key_here';
const BOTTOKEN = 'your_token_here';

const SCANINTERVAL_MS = 60000;
const LOGSCHANNELID = '1419261447875330108'; // Winning notifications
const WITHDRAWALCHANNELID = '1419261447875330108'; // Withdrawal notifications
const FAIRPLAYCHANNELID = '1419261447875330108'; // SkyRush Fair Play Protocol announcements

// Example embed with replacing branding
const withdrawalEmbed = new EmbedBuilder()
    .setTitle('Withdrawal Successfully Processed!')
    .setDescription(`${user.username} successfully withdrew from SkyRush!`)
    .setColor(0x00E5A8)
    .addFields(
        { name: 'User', value: user.id, inline: true },
        { name: 'Points Withdrawn', value: `${withdrawalData.points.toLocaleString()} points`, inline: true },
        { name: 'LTC Amount', value: `${withdrawalData.ltcAmount.toFixed(8)} LTC`, inline: true },
        { name: 'USD Value', value: `$${withdrawalData.amountUsd.toFixed(2)}`, inline: true },
        { name: 'Network Fee', value: feeDisplay, inline: true },
        { name: 'Processed', value: `<t:${Math.floor(Date.now()/1000)}:F>`, inline: true },
        { name: 'Destination', value: shortAddress, inline: false },
        { name: 'Transaction Hash', value: withdrawalData.txid.substring(0, 8) + '...' + withdrawalData.txid.substring(withdrawalData.txid.length - 8), inline: false }
    )
    .setFooter({ text: 'SkyRush Withdrawal Processed' })
    .setTimestamp();

// Continue rest of your bot logic and code chunk by chunk...

// ---- LEVEL SYSTEM CONFIGURATION ----
const LEVEL_CONFIG = [
    {
        name: "Emberling",
        threshold: 200,
        roleId: "1417516523345543239",
        reward: 2,
        emoji: "🔥",
        description: "Beginner in SkyRush, keep playing to rank up!"
    },
    {
        name: "Blaze",
        threshold: 1000,
        roleId: "1417516540191653999",
        reward: 5,
        emoji: "✨",
        description: "Your luck’s heating up in SkyRush!"
    },
    {
        name: "Inferno",
        threshold: 5000,
        roleId: "1417516544877160529",
        reward: 12,
        emoji: "🌪️",
        description: "SkyRush regular with some serious fire!"
    },
    {
        name: "Torrent",
        threshold: 12000,
        roleId: "1417516550183270400",
        reward: 24,
        emoji: "🌊",
        description: "SkyRush torrent of wins!"
    },
    {
        name: "Legend",
        threshold: 25000,
        roleId: "1417516556798584933",
        reward: 50,
        emoji: "👑",
        description: "SkyRush absolute top legend!"
    }
];

// ---- GLOBAL SETTINGS ----
const DATABASE_FILE = './skyrush-data.db';
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages
    ],
    partials: [Partials.Message, Partials.Channel, Partials.User]
});

let withdrawalData = {};
let user = {};
let feeDisplay = "N/A";
let shortAddress = "";
let channel = null;

// ---- FUNCTION BOILERPLATE ----
function getRandomId(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Further bot setup and logic follows here...
client.once('ready', () => {
    console.log(`SkyRush Bot Online: ${client.user.tag}`);
    // Announce start or set online embed in a specified channel if needed
});

// Additional bot handler functions, message event, and admin panel will be shown in the next chunk.

// ---- DATABASE INIT ----
const db = new sqlite3.Database(DATABASE_FILE, (err) => {
    if (err) {
        console.error("SkyRush: Failed to connect to database.", err);
    } else {
        console.log("SkyRush: Connected to database!");
    }
});

// ---- CORE BOT EVENT HANDLING ----
client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.content.startsWith(PREFIX)) return;

    const [command, ...args] = message.content
        .slice(PREFIX.length)
        .trim()
        .split(/ +/);
    const lowerCommand = command.toLowerCase();

    // ---- Main Command Switch ----
    switch (lowerCommand) {
        case "help":
        case "info":
            {
                const helpEmbed = new EmbedBuilder()
                    .setTitle("SkyRush Help & Information")
                    .setDescription(
                        "Welcome to **SkyRush**! Use `.play` to start playing, `.balance` to check your points, or `.withdraw` for LTC payouts.

**Admin/Owner Tools:**
`.add` - Add points
`.setlevel` - Set user level

Enjoy playing fair and growing your level!"
                    )
                    .setColor(0x00E5A8)
                    .setFooter({ text: "SkyRush Automated Bot" })
                    .setTimestamp();
                await message.channel.send({ embeds: [helpEmbed] });
            }
            break;
        // More command handlers will be included in the next chunk...
    }
});

// ---- EMBED/BRANDING HELPER ----
function makeAnnouncement(text) {
    return new EmbedBuilder()
        .setTitle("Announcement")
        .setDescription(text)
        .setColor(0x00E5A8)
        .setFooter({ text: "SkyRush Official" });
}

// Withdrawal & announcement logic, plus play & balance commands, will be covered next.

        // ---- Withdrawal command handler example ----
        case "withdraw":
            {
                // Withdrawal logic should validate user balance, subtract points, and send LTC using API
                if (!args[0]) {
                    return message.reply("Please provide your LTC wallet address.
Example: `.withdraw <ltc_address> <amount>`");
                }
                const ltcAddress = args[0];
                const amount = parseInt(args[1]);
                // Sample database & API logic...
                // db.get("SELECT points FROM users WHERE userId = ?", [message.author.id], (err, row) => {
                //     if (row && row.points >= amount) {
                //         // initiate LTC transfer using your api
                //         // update database
                //         // log transaction
                //     }
                // });
                const embed = new EmbedBuilder()
                    .setTitle("SkyRush Withdrawal Requested")
                    .setDescription(`Requested withdrawal of ${amount} points to address: `${ltcAddress}`. Admin will review and process soon.`)
                    .setFooter({ text: "SkyRush Secure Gambling" })
                    .setColor(0x00E5A8)
                    .setTimestamp();
                return message.reply({ embeds: [embed] });
            }
            break;
        // ---- Play, balance, leaderboard etc. commands yahan aayenge ----

        case "balance":
            {
                // Placeholder: Retrieve user balance from db
                const embed = new EmbedBuilder()
                    .setTitle("SkyRush Balance")
                    .setDescription(`<@${message.author.id}> Your balance: **0** points
Play to earn more!`)
                    .setFooter({ text: "SkyRush Game Balance" })
                    .setColor(0x00E5A8);
                return message.reply({ embeds: [embed] });
            }
            break;

        // ---- Coinflip example starter (expand as needed) ----
        case "coinflip":
            {
                const wager = parseInt(args[0]);
                if (!wager || wager <= 0) {
                    return message.reply("Please provide a wager amount.
Example: `.coinflip 100`");
                }
                // Placeholder: *db call*, check/withdraw user balance, update if win
                const outcome = Math.random() < 0.5 ? "heads" : "tails";
                // Placeholder payout logic
                const didWin = Math.random() < 0.45; // House edge
                const embed = new EmbedBuilder()
                    .setTitle("SkyRush Coinflip")
                    .setDescription(`It landed on **${outcome}**!
${didWin ? "You won!" : "You lost this time. Try again!"}`)
                    .setColor(didWin ? 0x00FF85 : 0xFF3A3A)
                    .setFooter({ text: "SkyRush Coinflip Game" })
                    .setTimestamp();
                // Add payout, balance update, leaderboard update etc. here!
                return message.reply({ embeds: [embed] });
            }
            break;

        // ---- You can continue adding command handlers for more games:
        // For example: .dice, .crash, .roulette, .lotto, .blackjack, etc.

        default:
            message.reply("Unknown command! Use `.help` to see available SkyRush commands.");
    }
});

// ---- Leaderboard, admin and utility functions aage rahenge ----

// ---- Leaderboard Command ----
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'leaderboard') {
        db.all("SELECT userId, points FROM users ORDER BY points DESC LIMIT 10", [], (err, rows) => {
            if (err) {
                return interaction.reply("Leaderboard unavailable, try again later!");
            }
            let desc = "";
            rows.forEach((row, idx) => {
                desc += `**${idx + 1}.** <@${row.userId}> – ${row.points} points
`;
            });
            const embed = new EmbedBuilder()
                .setTitle("SkyRush Top 10 Leaderboard")
                .setDescription(desc.length > 0 ? desc : "No players yet!")
                .setColor(0x00E5A8)
                .setFooter({ text: "SkyRush Leaderboard" })
                .setTimestamp();
            interaction.reply({ embeds: [embed] });
        });
    }
});

// ---- ADMIN/OWNER TOOLS (Add Points Example) ----
client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.content.startsWith(PREFIX)) return;

    const [command, ...args] = message.content
        .slice(PREFIX.length)
        .trim()
        .split(/ +/);
    if (command.toLowerCase() === "add") {
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return message.reply("Only SkyRush admins can add points.");
        }
        if (!args[0] || !args[1]) {
            return message.reply("Usage: `.add <@user|userid> <amount>`");
        }
        const userId = args[0].replace(/[<@!>]/g, "");
        const amount = parseInt(args[1]);
        // This sample assumes a table called `users` with `userId` and `points`
        db.run("INSERT INTO users (userId, points) VALUES (?, ?) ON CONFLICT(userId) DO UPDATE SET points = points + ?",
            [userId, amount, amount],
            function (err) {
                if (err) {
                    return message.reply("Failed to add points.");
                }
                message.reply(`Added ${amount} points to <@${userId}> on SkyRush!`);
            }
        );
    }
});

// Database table creation, fair play embed, and deposit handling aage aayenge.

// ---- DATABASE INITIALIZATION FOR USERS ----
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        userId TEXT PRIMARY KEY,
        points INTEGER DEFAULT 0,
        level INTEGER DEFAULT 1,
        lastPlayed INTEGER DEFAULT 0
    )`);
});

// ---- FAIR PLAY PROTOCOL ANNOUNCEMENT ----
async function sendFairPlayAnnouncementChannel() {
    try {
        const channel = await client.channels.fetch(FAIRPLAYCHANNELID);
        if (!channel) return;
        const embed = new EmbedBuilder()
            .setTitle("SkyRush Fair Play Protocol")
            .setDescription("All games on SkyRush are provably fair. We monitor gameplay to ensure no cheating or bots. Play responsibly!")
            .setColor(0x00E5A8)
            .setFooter({ text: "SkyRush Official Fairness" })
            .setTimestamp();
        await channel.send({ embeds: [embed] });
    } catch (error) {
        console.error("Failed to send fair play announcement:", error);
    }
}

client.once('ready', () => {
    console.log(`SkyRush Bot Online: ${client.user.tag}`);
    sendFairPlayAnnouncementChannel();
});

// ---- GENERATE DEPOSIT WALLET ADDRESS & QR CODE ----
async function generateDepositWallet(userId) {
    // Example: Generate a unique LTC deposit address per user (replace with your real API or wallet integration)
    const uniqueAddress = `ltc1uniqueaddress_${userId}`;
    const canvas = createCanvas(200, 200);
    await QRCode.toCanvas(canvas, uniqueAddress, {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 200,
    });
    const buffer = canvas.toBuffer('image/png');
    return { uniqueAddress, qrBuffer: buffer };
}

// Usage example for deposit command
client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.content.startsWith(PREFIX)) return;

    const [command] = message.content.slice(PREFIX.length).trim().split(/ +/);

    if (command.toLowerCase() === "deposit") {
        const userId = message.author.id;
        const { uniqueAddress, qrBuffer } = await generateDepositWallet(userId);
        const attachment = new AttachmentBuilder(qrBuffer, { name: 'deposit-qr.png' });
        const embed = new EmbedBuilder()
            .setTitle("SkyRush Deposit Wallet")
            .setDescription(`Deposit Litecoin (LTC) to the following address:
`${uniqueAddress}``)
            .setColor(0x00E5A8)
            .setImage('attachment://deposit-qr.png')
            .setFooter({ text: "SkyRush Deposit System" })
            .setTimestamp();
        await message.reply({ embeds: [embed], files: [attachment] });
    }
});

// ---- WITHDRAWAL PROCESSING LOGIC ----
async function processWithdrawal(userId, amount, ltcAddress) {
  // Check if user has sufficient points
  db.get("SELECT points FROM users WHERE userId = ?", [userId], (err, row) => {
    if (err) {
      console.error("DB error on withdrawal:", err);
      return;
    }
    if (!row || row.points < amount) {
      console.log("Insufficient balance for withdrawal");
      return;
    }
    // Deduct points from user
    db.run("UPDATE users SET points = points - ? WHERE userId = ?", [amount, userId], (updateErr) => {
      if (updateErr) {
        console.error("DB error updating points:", updateErr);
        return;
      }
      // Log transaction somewhere, or send to admin channel
      console.log(`User ${userId} withdrew ${amount} points to LTC address ${ltcAddress}`);
      // Implement LTC transfer via your API here
    });
  });
}

// Example usage inside withdraw command handler (refined logic goes here)

// ---- ADMIN COMMAND: SET USER LEVEL ----
client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.content.startsWith(PREFIX)) return;

    const [command, ...args] = message.content.slice(PREFIX.length).trim().split(/ +/);

    if (command.toLowerCase() === "setlevel") {
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return message.reply("Only SkyRush admins can set levels.");
        }

        if (!args[0] || !args[1]) {
            return message.reply("Usage: `.setlevel <@user|userid> <level>`");
        }

        const userId = args[0].replace(/[<@!>]/g, "");
        const level = parseInt(args[1]);

        if (isNaN(level) || level < 1) {
            return message.reply("Invalid level value.");
        }

        // Update level in database
        db.run("INSERT INTO users (userId, level) VALUES (?, ?) ON CONFLICT(userId) DO UPDATE SET level = ?",
            [userId, level, level],
            function (err) {
                if (err) {
                    return message.reply("Failed to set level.");
                }
                message.reply(`Set level ${level} for <@${userId}> in SkyRush.`);
            });
    }
});

// ---- ERROR HANDLING FOR COMMANDS ----
process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', error => {
    console.error('Uncaught exception:', error);
});

// Keep the bot alive with a heartbeat if needed (example for hosting services).

// ---- BOT LOGIN AND STARTUP ----
client.login(BOTTOKEN).then(() => {
    console.log("SkyRush Bot logged in and ready.");
}).catch((err) => {
    console.error("Login failed:", err);
});

// Optionally handle bot disconnects, reconnects here
client.on('disconnect', () => {
    console.warn("SkyRush Bot disconnected!");
});
client.on('reconnecting', () => {
    console.log("SkyRush Bot reconnecting...");
});

// ---- UTILITY FUNCTIONS ----
function formatPoints(points) {
    return points.toLocaleString();
}

function isValidLTCAddress(address) {
    // Basic Litecoin address validation regex (replace with better checks if needed)
    return /^ltc1[a-z0-9]{25,35}$/i.test(address);
}

// ---- HELPER FOR PROVABLE FAIRNESS ----
function generateProvableRandom(seed) {
    const hash = crypto.createHash('sha256').update(seed).digest('hex');
    return parseInt(hash.substring(0, 8), 16) / 0xffffffff;
}

// ---- RANDOM ID GENERATOR (already defined but just noting) ----
function getRandomId(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// ---- MESSAGE HANDLER CONTINUED FOR ADDITIONAL GAMES AND ADMIN COMMANDS ----
client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.content.startsWith(PREFIX)) return;

    const [command, ...args] = message.content.slice(PREFIX.length).trim().split(/ +/);
    const lowerCommand = command.toLowerCase();

    switch (lowerCommand) {
        case "crash":
            {
                // Placeholder for crash game implementation
                return message.reply("Crash game is under construction. Check back soon!");
            }
        case "roulette":
            {
                // Placeholder for roulette game implementation
                return message.reply("Roulette game is under construction. Stay tuned!");
            }
        case "lotto":
            {
                // Placeholder for lotto game implementation
                return message.reply("Lotto game is coming soon!");
            }
        case "blackjack":
            {
                // Placeholder for blackjack game implementation
                return message.reply("Blackjack is currently unavailable.");
            }
        // Add more games as needed

        default:
            break;
    }
});

// ---- DEPOSIT CHECKING VIA WEBHOOK (EXAMPLE STRUCTURE) ----
const express = require('express');
const app = express();

app.use(express.json());

app.post('/webhook', (req, res) => {
    const depositData = req.body;

    // Validate webhook secret or signature here (not implemented)

    if (depositData && depositData.address && depositData.amount && depositData.userId) {
        // Add points to user balance in DB
        const pointsToAdd = parseInt(depositData.amount * 1000); // example conversion rate
        db.run("INSERT INTO users (userId, points) VALUES (?, ?) ON CONFLICT(userId) DO UPDATE SET points = points + ?",
            [depositData.userId, pointsToAdd, pointsToAdd],
            function (err) {
                if (err) {
                    console.error("Failed to update points on deposit webhook:", err);
                    return res.status(500).send("Error");
                }
                console.log(`Added ${pointsToAdd} points to ${depositData.userId} from deposit.`);
                res.status(200).send("OK");
            }
        );
    } else {
        res.status(400).send("Invalid deposit data");
    }
});

// Start webhook server on port 3000 or environment variable PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`SkyRush Deposit webhook server running on port ${PORT}`);
});

// ---- MISCELLANEOUS HELPERS ----
function logTransaction(userId, action, details) {
    // Example logging function to either file or DB
    const logEntry = `[${new Date().toISOString()}] User: ${userId}, Action: ${action}, Details: ${details}`;
    console.log(logEntry);
    // Optionally write to a log file or dedicated DB table
}

// ---- CLEANUP ON EXIT ----
process.on('SIGINT', () => {
    console.log("Gracefully shutting down SkyRush Bot...");
    db.close();
    process.exit();
});

// ---- BOT ENVIRONMENT VARIABLES ----
const BOTTOKEN = process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';
const PREFIX = '.';

// ---- DATABASE (Assuming sqlite3) ----
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./skyrush.db', (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SkyRush database.');
    }
});

// ---- DISCORD CLIENT SETUP ----
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// ---- INITIALIZE DB TABLES ----
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        userId TEXT PRIMARY KEY,
        points INTEGER DEFAULT 0,
        level INTEGER DEFAULT 1
    )`);
});

// ---- CLIENT EVENT: READY ----
client.once('ready', () => {
    console.log(`SkyRush Bot is online as ${client.user.tag}`);
    // Additional startup tasks
});

// ---- LOGIN ----
client.login(BOTTOKEN).then(() => {
    console.log('SkyRush Bot logged in.');
}).catch(console.error);