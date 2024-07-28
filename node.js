const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/update-json', async (req, res) => {
    const { content, message } = req.body;
    const githubToken = process.env.GITHUB_TOKEN;
    const owner = 'yourusername';
    const repo = 'json-editor';
    const path = 'computerNames.json';

    // Get the SHA of the existing file
    const fileResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
        headers: {
            'Authorization': `token ${githubToken}`
        }
    });

    if (!fileResponse.ok) {
        return res.status(500).json({ success: false, error: 'Failed to fetch file' });
    }

    const fileData = await fileResponse.json();
    const sha = fileData.sha;

    // Update the file in the repository
    const updateResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${githubToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: message,
            content: content,
            sha: sha
        })
    });

    if (updateResponse.ok) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false, error: 'Failed to update file' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
