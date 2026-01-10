const form = document.getElementById('shorten-form');
const resultDiv = document.getElementById('result');

async function performShortening(urlInput) {
    resultDiv.textContent = 'Compressing...';
    
    try {
        const response = await fetch(`${config.API_BASE_URL}/make_url?url=${encodeURIComponent(urlInput)}`, {
            method: 'POST'
        });
        
        if (response.ok) {
            const data = await response.json();
            const shortCode = Object.values(data)[0];
            const shortUrl = `https://url.jam06452.uk/${shortCode}`;
            
            // Clear previous results and safely build DOM elements
            resultDiv.textContent = '';
            const textNode = document.createTextNode('Shortened URL: ');
            const link = document.createElement('a');
            link.href = shortUrl;
            link.textContent = shortUrl;
            link.style.cursor = 'pointer';
            
            link.addEventListener('click', (e) => {
                e.preventDefault();
                navigator.clipboard.writeText(shortUrl).then(() => {
                    const originalText = link.textContent;
                    link.textContent = 'Copied!';
                    setTimeout(() => {
                        link.textContent = originalText;
                    }, 1500);
                });
            });
            
            resultDiv.appendChild(textNode);
            resultDiv.appendChild(link);
        } else {
            resultDiv.innerText = 'Error shortening URL';
        }
    } catch (error) {
        console.error('Error:', error);
        resultDiv.innerText = 'Error connecting to server. Make sure the backend is running and CORS is enabled.';
    }
}

form.addEventListener('submit', async function(e) {
    e.preventDefault();
    let urlInput = document.getElementById('url-input').value.trim();
    
    // Basic Protocol Auto-fix
    if (!/^https?:\/\//i.test(urlInput)) {
        urlInput = 'https://' + urlInput;
    }

    // Remove www. and trailing slash
    urlInput = urlInput.replace(/^(https?:\/\/)(www\.)/, '$1');
    if (urlInput.endsWith('/')) {
        urlInput = urlInput.slice(0, -1);
    }

    // URL Syntax Validation
    try {
        new URL(urlInput);
    } catch (err) {
        resultDiv.innerText = 'Invalid URL format. Please include http:// or https://';
        return;
    }

    resultDiv.innerText = 'Verifying site reachability...';

    // Verify availability (Ping)
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        await fetch(urlInput, { 
            method: 'HEAD', 
            mode: 'no-cors', 
            signal: controller.signal 
        });
        clearTimeout(timeoutId);
        
        // If successful (or opaque response), proceed
        performShortening(urlInput);
        
    } catch (error) {
        console.warn('Ping check failed', error);
        resultDiv.innerHTML = '';
        
        const msg = document.createElement('div');
        msg.textContent = 'Site unreachable. Request denied.';
        msg.style.color = '#ff4444';
        
        resultDiv.appendChild(msg);
    }
});