const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/repos', async (req, res) => {
    const apiUrl = 'https://api.github.com/orgs/takenet/repos';
    try {
        const response = await axios.get(apiUrl, {
            params: {
                sort: 'created',
                direction: 'asc',
                per_page: 100
            },
            headers: {
                'Accept': 'application/vnd.github+json',
                'User-Agent': 'GitHub-API-Request'
            }
        });

        const csharpRepos = response.data.filter(repo => repo.language === 'C#');
        const oldestRepos = csharpRepos.slice(0, 5);

        res.json(oldestRepos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
