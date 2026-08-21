const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: 'server/.env' });

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const hash = await bcrypt.hash('admin123', 10);
    await mongoose.connection.db.collection('users').updateOne(
        { email: 'thakur645@gmail.com' },
        { $set: { password: hash } }
    );
    console.log('Password updated to admin123');
    process.exit(0);
});
