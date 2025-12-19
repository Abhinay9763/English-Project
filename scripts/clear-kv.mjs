import { kv } from '@vercel/kv';

async function clearKV() {
    try {
        console.log('🗑️ Clearing leaderboard data in Vercel KV...');

        // We set the users array to empty
        await kv.set('users', []);

        console.log('✅ Success! Leaderboard data has been reset.');
    } catch (error) {
        console.error('❌ Failed to clear KV:', error);
        console.log('\nTIP: Make sure you have your KV environment variables in .env.local');
    }
}

clearKV();
