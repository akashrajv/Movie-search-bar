const fs = require('fs');
const path = require('path');
const https = require('https');

const jsonPath = path.join(__dirname, 'tamil_movies.json');
const movies = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

async function fetchWikipediaPoster(wikiUrl) {
    if (!wikiUrl) return null;
    
    // Extract title from URL: https://en.wikipedia.org/wiki/Title
    try {
        const urlObj = new URL(wikiUrl);
        const title = urlObj.pathname.split('/wiki/')[1];
        if (!title) return null;

        const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${title}&prop=pageimages&format=json&pithumbsize=1000`;

        return new Promise((resolve) => {
            https.get(apiUrl, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => {
                    try {
                        const json = JSON.parse(data);
                        if (!json.query || !json.query.pages) {
                            resolve(null);
                            return;
                        }
                        const pages = json.query.pages;
                        const pageId = Object.keys(pages)[0];
                        if (pageId === '-1') {
                            resolve(null);
                            return;
                        }
                        const thumbnail = pages[pageId].thumbnail;
                        if (thumbnail && thumbnail.source) {
                            resolve(thumbnail.source);
                        } else {
                            resolve(null);
                        }
                    } catch (e) {
                        console.error(`Error parsing Wikipedia response for ${title}:`, e);
                        resolve(null);
                    }
                });
            }).on('error', (err) => {
                console.error(`Error fetching Wikipedia API for ${title}:`, err);
                resolve(null);
            });
        });
    } catch (e) {
        console.error(`Invalid Wikipedia URL: ${wikiUrl}`);
        return null;
    }
}

async function updatePosters() {
    console.log(`Starting poster update for ${movies.length} movies...`);

    for (let i = 0; i < movies.length; i++) {
        const movie = movies[i];
        const wikiUrl = movie.externalLinks ? movie.externalLinks.wikipedia : null;

        if (wikiUrl) {
            console.log(`[${i + 1}/${movies.length}] Fetching poster for: ${movie.title}...`);
            const poster = await fetchWikipediaPoster(wikiUrl);
            if (poster) {
                console.log(`   Found poster: ${poster}`);
                movie.poster = poster;
            } else {
                console.log(`   No poster found on Wikipedia for ${movie.title}.`);
            }
        } else {
            console.log(`[${i + 1}/${movies.length}] No Wikipedia link for: ${movie.title}. Skipping...`);
        }
        
        // Add a small delay to be nice to Wikipedia API
        await new Promise(r => setTimeout(r, 200));
    }

    fs.writeFileSync(jsonPath, JSON.stringify(movies, null, 2));
    console.log(`\nUpdate complete! Results saved to ${jsonPath}.`);
}

updatePosters().catch(console.error);
