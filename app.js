// app.js - VoluntYouth Frontend Logic
// This file is already included in index.html's script tag
// Kept here as reference for the JavaScript code

const sampleData = {
    "last_updated": "2024-01-15T09:00:00",
    "opportunities": [
        {
            "title": "Dog Walking at Animal Shelter",
            "org_name": "Paws & Care Animal Shelter",
            "description": "Help rescue dogs get exercise and socialization. Flexible hours, all skill levels welcome.",
            "source_url": "https://www.volunteermatch.org/search/opp/...",
            "source": "volunteermatch",
            "cause": "animals",
            "type": "ongoing",
            "distance": 2.3
        },
        {
            "title": "Trail Cleanup at Riverside Park",
            "org_name": "Springfield Parks & Recreation",
            "description": "Join us for a 4-hour trail cleanup on Saturday mornings. All tools and supplies provided.",
            "source_url": "https://www.springfield.gov/parks/volunteer",
            "source": "local",
            "cause": "environment",
            "type": "one-time",
            "distance": 4.1
        },
        {
            "title": "Tech Tutor for Seniors",
            "org_name": "Digital Inclusion Initiative",
            "description": "Teach seniors how to use email, video calls, and social media. Virtual, 1-2 hours per week.",
            "source_url": "https://www.volunteermatch.org/search/opp/...",
            "source": "volunteermatch",
            "cause": "education",
            "type": "virtual",
            "distance": 3.5
        },
        {
            "title": "Library Reading Buddy Program",
            "org_name": "Springfield Public Library",
            "description": "Read with elementary kids once a week. Help build confidence and love of reading.",
            "source_url": "https://www.springfield-library.org/volunteer",
            "source": "local",
            "cause": "education",
            "type": "ongoing",
            "distance": 1.8
        },
        {
            "title": "Food Bank Sorting",
            "org_name": "City Harvest Food Bank",
            "description": "Sort and pack donations for families in need. 3-hour shifts available, groups welcome!",
            "source_url": "https://www.volunteermatch.org/search/opp/...",
            "source": "volunteermatch",
            "cause": "food",
            "type": "one-time",
            "distance": 5.2
        },
        {
            "title": "Senior Companion Program",
            "org_name": "Community Care Services",
            "description": "Visit with seniors, play games, help with activities. Makes a huge difference in their lives.",
            "source_url": "https://www.volunteermatch.org/search/opp/...",
            "source": "volunteermatch",
            "cause": "elderly",
            "type": "ongoing",
            "distance": 6.0
        },
        {
            "title": "Beach Cleanup & Ocean Advocacy",
            "org_name": "Ocean Guardians",
            "description": "Collect trash and learn about marine conservation. Virtual workshop + in-person cleanup.",
            "source_url": "https://www.meetup.com/events/...",
            "source": "meetup",
            "cause": "environment",
            "type": "one-time",
            "distance": 8.5
        },
        {
            "title": "Youth After-School Mentor",
            "org_name": "Big Brothers Big Sisters",
            "description": "Mentor a young person weekly. Help them with homework, build confidence, be a friend.",
            "source_url": "https://www.volunteermatch.org/search/opp/...",
            "source": "volunteermatch",
            "cause": "community",
            "type": "ongoing",
            "distance": 3.2
        }
    ]
};

let allOpportunities = [];

document.addEventListener('DOMContentLoaded', () => {
    loadOpportunities();
    setupFilters();
});

function loadOpportunities() {
    try {
        allOpportunities = sampleData.opportunities || [];
        console.log(`✓ Loaded ${allOpportunities.length} opportunities`);
        renderOpportunities();
    } catch (error) {
        console.error('Error loading opportunities:', error);
        showError('Could not load opportunities. Please refresh the page.');
    }
}

function renderOpportunities() {
    const causeFilter = document.getElementById('cause-filter').value;
    const typeFilter = document.getElementById('type-filter').value;
    const distanceFilter = parseInt(document.getElementById('distance-filter').value);

    let filtered = allOpportunities.filter(opp => {
        if (causeFilter && opp.cause !== causeFilter) return false;
        if (typeFilter && opp.type !== typeFilter) return false;
        if (opp.distance > distanceFilter) return false;
        return true;
    });

    filtered.sort((a, b) => a.distance - b.distance);

    document.getElementById('result-count').textContent = 
        `${filtered.length} opportunit${filtered.length !== 1 ? 'ies' : 'y'} found`;

    const container = document.getElementById('opportunities');
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty">
                <div class="empty-icon">🔍</div>
                <h2>No opportunities found</h2>
                <p>Try adjusting your filters to see more options</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(opp => `
        <div class="opportunity">
            <h3>${opp.title}</h3>
            <div class="opportunity-org">${opp.org_name}</div>
            <p>${opp.description}</p>
            <div class="meta">
                <span class="badge source-${opp.source}">
                    <span class="source-tag">${opp.source}</span>
                </span>
                <span class="badge">📍 ${opp.distance} mi</span>
                ${opp.cause ? `<span class="badge">${getCauseEmoji(opp.cause)} ${opp.cause}</span>` : ''}
                ${opp.type ? `<span class="badge">${getTypeLabel(opp.type)}</span>` : ''}
            </div>
            <a href="${opp.source_url}" target="_blank" rel="noopener noreferrer" class="button">
                View & Sign Up →
            </a>
        </div>
    `).join('');
}

function setupFilters() {
    document.getElementById('distance-filter').addEventListener('change', (e) => {
        document.getElementById('distance-value').textContent = e.target.value + ' mi';
        renderOpportunities();
    });

    document.getElementById('cause-filter').addEventListener('change', () => {
        renderOpportunities();
    });

    document.getElementById('type-filter').addEventListener('change', () => {
        renderOpportunities();
    });
}

function getCauseEmoji(cause) {
    const emojis = {
        'animals': '🐾',
        'environment': '🌿',
        'education': '📚',
        'food': '🥕',
        'community': '💙',
        'elderly': '👴'
    };
    return emojis[cause] || '✨';
}

function getTypeLabel(type) {
    const labels = {
        'one-time': '⭐ One-Time',
        'ongoing': '🔄 Ongoing',
        'virtual': '💻 Virtual'
    };
    return labels[type] || type;
}

function showError(message) {
    document.getElementById('error-container').innerHTML = 
        `<div class="error">⚠️ ${message}</div>`;
}
