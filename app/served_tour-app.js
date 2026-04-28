// Configuration
const API_BASE = window.location.origin;
let currentTourist = null;
let currentPlace = null;
let allPlaces = [];
let allRecommendations = [];
let allFacilities = [];
let currentFacilityType = 'hospital';

// Page Navigation
function goToPage(pageNum) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(`page-${pageNum}`).classList.add('active');
}

// ==================== PAGE 1: Tourist Info ====================
document.getElementById('touristForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('touristName').value.trim();
    const memberCount = parseInt(document.getElementById('memberCount').value);
    
    if (!name || !memberCount || memberCount < 1) {
        alert('Please fill in all fields correctly');
        return;
    }
    
    currentTourist = {
        name,
        memberCount
    };
    
    // Go to Page 2
    goToPage(2);
    await loadPlaces();
});

// ==================== PAGE 2: Place Selection ====================
async function loadPlaces() {
    try {
        const response = await fetch(`${API_BASE}/api/sites`);
        if (!response.ok) throw new Error(`Failed to load places (${response.status})`);
        const data = await response.json();
        allPlaces = data.sites || [];
        
        // Update greeting
        document.getElementById('greetingText').innerHTML = 
            `<strong>Hello, ${currentTourist.name}</strong><br>Group size: <strong>${currentTourist.memberCount} members</strong>`;
        
        // Hide loader, show places
        document.getElementById('placesLoader').style.display = 'none';
        document.getElementById('placesError').style.display = 'none';
        displayPlaces();
    } catch (error) {
        console.error('Error loading places:', error);
        document.getElementById('placesLoader').style.display = 'none';
        document.getElementById('placesError').style.display = 'block';
        document.getElementById('placesErrorText').textContent = error.message || String(error);
    }
}

function displayPlaces() {
    const container = document.getElementById('placesContainer');
    container.innerHTML = '';
    
    allPlaces.forEach(place => {
        const occupancyPercent = Math.round((place.currentCount / place.capacity) * 100);
        const isOpen = place.isOpen !== false;
        
        const card = document.createElement('div');
        card.className = 'place-card';
        card.innerHTML = `
            <h3>${place.name}</h3>
            <div class="place-card-info">
                <div class="place-card-info-row">
                    <i class="fas fa-users"></i>
                    <span>Occupancy: ${place.currentCount}/${place.capacity}</span>
                </div>
            </div>
            <div class="place-card-footer">
                <span class="status-badge ${isOpen ? 'open' : 'closed'}">
                    ${isOpen ? '✓ Open' : '✕ Closed'}
                </span>
                <span class="occupancy-percent">${occupancyPercent}%</span>
            </div>
        `;
        
        card.addEventListener('click', () => selectPlace(place));
        container.appendChild(card);
    });
}

function selectPlace(place) {
    currentPlace = place;
    goToPage(3);
    loadPlaceDetails();
}

// ==================== PAGE 3: Place Details ====================
async function loadPlaceDetails() {
    try {
        document.getElementById('details-loader').style.display = 'flex';
        document.getElementById('detailsError').style.display = 'none';
        
        // Update header
        const isOpen = currentPlace.isOpen !== false;
        const occupancyPercent = Math.round((currentPlace.currentCount / currentPlace.capacity) * 100);
        
        document.getElementById('placeName').textContent = currentPlace.name;
        document.getElementById('crowdCount').textContent = `${currentPlace.currentCount}/${currentPlace.capacity}`;
        document.getElementById('occupancyPercent').textContent = `${occupancyPercent}%`;
        
        // Update occupancy circle
        const circumference = 2 * Math.PI * 45;
        const offset = circumference - (occupancyPercent / 100) * circumference;
        document.getElementById('occupancyCircle').style.strokeDashoffset = offset;
        
        // Update status badge
        const statusBadge = document.getElementById('placeStatus');
        statusBadge.className = `status-badge ${isOpen ? 'open' : 'closed'}`;
        statusBadge.textContent = isOpen ? '✓ Open' : '✕ Closed';
        
        // Load recommendations
        const recResponse = await fetch(
            `${API_BASE}/api/recommendations?lat=${currentPlace.lat}&lng=${currentPlace.lng}&limit=5`
        );
        if (recResponse.ok) {
            const recData = await recResponse.json();
            allRecommendations = recData.recommendations || [];
        } else {
            console.warn('Recommendations fetch failed:', recResponse.status);
            allRecommendations = [];
        }
        displayRecommendations();
        
        // Load facilities
        try {
            await loadFacilities('hospital');
        } catch (e) {
            // loadFacilities already logs and handles errors; ensure UI shows fallback
            console.warn('Facilities could not be loaded:', e);
            const facilitiesContainer = document.getElementById('facilitiesList');
            if (facilitiesContainer) {
                facilitiesContainer.innerHTML = '<p style="text-align: center; color: var(--ink-soft);">Unable to load nearby facilities right now.</p>';
            }
        }
        
        document.getElementById('details-loader').style.display = 'none';
    } catch (error) {
        console.error('Error loading place details:', error);
        document.getElementById('details-loader').style.display = 'none';
        document.getElementById('detailsError').style.display = 'block';
        document.getElementById('detailsErrorText').textContent = error.message;
    }
}

async function loadFacilities(type) {
    try {
        currentFacilityType = type;
        if (!currentPlace || typeof currentPlace.lat === 'undefined') {
            throw new Error('No selected place');
        }

        const response = await fetch(
            `${API_BASE}/api/nearby?lat=${currentPlace.lat}&lng=${currentPlace.lng}&type=${type}&radius=3000&limit=10`
        );

        if (!response.ok) {
            // Provide a helpful message when upstream rate limits occur
            const errText = `Nearby fetch failed (${response.status})`;
            console.warn(errText);
            allFacilities = [];
            const container = document.getElementById('facilitiesList');
            if (container) container.innerHTML = `<p style="text-align:center;color:var(--ink-soft);">Unable to load nearby services (code ${response.status}). Try again later.</p>`;
            return;
        }

        const data = await response.json();
        allFacilities = data.places || [];
        
        // Update active filter chip
        document.querySelectorAll('.filter-chip').forEach(chip => {
            chip.classList.toggle('active', chip.dataset.type === type);
        });
        
        displayFacilities();
    } catch (error) {
        console.error('Error loading facilities:', error);
        allFacilities = [];
        displayFacilities();
    }
}

function displayFacilities() {
    const container = document.getElementById('facilitiesList');
    container.innerHTML = '';
    
    if (allFacilities.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--ink-soft);">No facilities found nearby</p>';
        return;
    }
    
    allFacilities.forEach(facility => {
        const item = document.createElement('div');
        item.className = 'facility-item';
        item.innerHTML = `
            <div class="facility-icon">
                <i class="fas fa-map-pin"></i>
            </div>
            <div class="facility-content">
                <p class="facility-name">${facility.name}</p>
                <p class="facility-category">
                    ${facility.category}${facility.address ? ' · ' + facility.address : ''}
                </p>
            </div>
        `;
        container.appendChild(item);
    });
}

function displayRecommendations() {
    const container = document.getElementById('recommendationsList');
    container.innerHTML = '';
    
    if (allRecommendations.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--ink-soft);">No recommendations available</p>';
        return;
    }
    
    allRecommendations.forEach(rec => {
        const recOccupancy = Math.round((rec.occupancyRatio) * 100);
        const item = document.createElement('div');
        item.className = 'recommendation-item';
        item.style.cursor = 'pointer';
        item.innerHTML = `
            <div style="display: flex; gap: 12px; width: 100%;">
                <div class="recommendation-icon">
                    <i class="fas fa-lightbulb"></i>
                </div>
                <div class="recommendation-content" style="flex: 1;">
                    <p class="recommendation-name">${rec.name}</p>
                    <p class="recommendation-meta">
                        Crowd: <strong>${rec.crowdLevel}</strong> · Distance: <strong>${rec.distanceKm.toFixed(1)} km</strong>
                    </p>
                    <div class="recommendation-crowd">
                        <span class="recommendation-crowd-label">${rec.currentCount}/${rec.capacity}</span>
                        <span class="recommendation-crowd-value">${recOccupancy}%</span>
                    </div>
                </div>
            </div>
            <div style="align-self: flex-end; color: var(--ink-soft); font-size: 1.2rem;">
                <i class="fas fa-arrow-right"></i>
            </div>
        `;
        
        item.addEventListener('click', () => selectRecommendedPlace(rec));
        container.appendChild(item);
    });
}

function selectRecommendedPlace(recommendation) {
    // Update currentPlace with the recommended place details
    currentPlace = {
        id: recommendation.siteId,
        name: recommendation.name,
        lat: allPlaces.find(p => p.id === recommendation.siteId)?.lat || currentPlace.lat,
        lng: allPlaces.find(p => p.id === recommendation.siteId)?.lng || currentPlace.lng,
        capacity: recommendation.capacity,
        currentCount: recommendation.currentCount,
        occupancyRatio: recommendation.occupancyRatio,
        isOpen: true
    };
    
    // Find from allPlaces if available
    const found = allPlaces.find(p => p.id === recommendation.siteId);
    if (found) {
        currentPlace = { ...found };
    }
    
    // Reload place details
    loadPlaceDetails();
    
    // Show notification
    alert(`Switched to ${recommendation.name}`);
}

// ==================== Tab Management ====================
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;
        
        // Update active button
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update active content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');
        
        // Load map if map tab is opened
        if (tabName === 'map') {
            loadMap();
        }
    });
});

// ==================== Facility Filter ====================
document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', async () => {
        const type = chip.dataset.type;
        await loadFacilities(type);
    });
});

// ==================== Map ====================
function loadMap() {
    const container = document.getElementById('mapContainer');
    if (!container) return;

    // Guard against missing currentPlace
    if (!currentPlace) {
        container.innerHTML = '<p style="text-align:center;color:var(--ink-soft);">No place selected</p>';
        return;
    }

    const lat = typeof currentPlace.lat === 'number' ? currentPlace.lat.toFixed(4) : 'N/A';
    const lng = typeof currentPlace.lng === 'number' ? currentPlace.lng.toFixed(4) : 'N/A';

    // Simple text-based representation
    container.innerHTML = `
        <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 10px; color: var(--ink-soft);">
            <i class="fas fa-map" style="font-size: 2rem;"></i>
            <p><strong>${currentPlace.name || 'Unknown place'}</strong></p>
            <p style="font-size: 0.9rem;">Latitude: ${lat}</p>
            <p style="font-size: 0.9rem;">Longitude: ${lng}</p>
            <p style="font-size: 0.85rem; color: #999; margin-top: 10px;">
                <i class="fas fa-info-circle"></i> Showing ${allFacilities.length} nearby ${currentFacilityType}(s)
            </p>
        </div>
    `;
}

// ==================== Initialize ====================
document.addEventListener('DOMContentLoaded', () => {
    goToPage(1);
    console.log('Tour Pulse Web App Ready');
});

