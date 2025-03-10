const fs = require('fs-extra');
const path = require('path');
const marked = require('marked');

// Ensure blog directory exists in root
fs.ensureDirSync('blog');

// Copy static assets to root
fs.copySync('public/css', 'css', { overwrite: true });

// Convert markdown files to HTML
function convertMarkdownToHtml(markdown, template) {
    const html = marked.parse(markdown);
    return template.replace('{{content}}', html);
}

// Read template
const template = fs.readFileSync('templates/page.html', 'utf-8');

// Process markdown files in root content directory
const contentDir = 'content';
const files = fs.readdirSync(contentDir);

files.forEach(file => {
    if (file.endsWith('.md')) {
        const markdown = fs.readFileSync(path.join(contentDir, file), 'utf-8');
        const html = convertMarkdownToHtml(markdown, template);
        const outputFile = file === 'index.md' ? 'index.html' : file.replace('.md', '.html');
        fs.writeFileSync(outputFile, html);
    }
});

// Process blog posts
const blogDir = path.join(contentDir, 'blog');
if (fs.existsSync(blogDir)) {
    const blogPosts = fs.readdirSync(blogDir);
    blogPosts.forEach(file => {
        if (file.endsWith('.md')) {
            const markdown = fs.readFileSync(path.join(blogDir, file), 'utf-8');
            const html = convertMarkdownToHtml(markdown, template);
            const outputFile = path.join('blog', file.replace('.md', '.html'));
            fs.writeFileSync(outputFile, html);
        }
    });
} 