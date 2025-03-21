/**
 * Agile Project Management App
 * Main JavaScript functionality
 */

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    console.log('Agile Project Management App initialized');
    
    // Initialize Bootstrap tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    
    // Initialize dropdown functionality
    const dropdownElementList = document.querySelectorAll('.dropdown-toggle');
    const dropdownList = [...dropdownElementList].map(dropdownToggleEl => new bootstrap.Dropdown(dropdownToggleEl));
    
    // Fetch and render sample data
    loadDashboardData();
    
    // Event listeners for nav links - removed alert popups
    setupNavigation();
});

/**
 * Set up navigation event listeners
 */
function setupNavigation() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only prevent default if the href is "#" (placeholder link)
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                console.log(`Navigation to: ${this.textContent.trim()}`);
            }
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
        });
    });
}

/**
 * Load dashboard data from API (simulated)
 */
function loadDashboardData() {
    // In a real application, this would fetch data from your backend API
    // For now, we'll simulate a network request
    
    console.log('Loading dashboard data...');
    
    // Simulate API delay
    setTimeout(() => {
        renderProjectTimeline();
        renderTeamVelocity();
    }, 500);
}

/**
 * Render project timeline visualization
 */
function renderProjectTimeline() {
    const timelineElement = document.querySelector('.timeline-placeholder');
    
    // Only proceed if element exists on the current page
    if (!timelineElement) return;
    
    // In a real app, you would use a charting library like Chart.js
    // For this mockup, we'll just update the text
    
    timelineElement.innerHTML = `
        <div class="text-center">
            <p class="mb-3">Project Timeline (Sample Data)</p>
            <div class="timeline-chart">
                <div class="d-flex justify-content-between mb-2">
                    <small>Jan</small>
                    <small>Feb</small>
                    <small>Mar</small>
                    <small>Apr</small>
                    <small>May</small>
                    <small>Jun</small>
                </div>
                <div class="timeline-bar bg-primary mb-2" style="width: 40%; margin-left: 10%;">Website Redesign</div>
                <div class="timeline-bar bg-success mb-2" style="width: 60%; margin-left: 20%;">Mobile App Dev</div>
                <div class="timeline-bar bg-warning mb-2" style="width: 30%; margin-left: 0%;">API Integration</div>
                <div class="timeline-bar bg-info mb-2" style="width: 25%; margin-left: 50%;">QA Testing</div>
            </div>
            <p class="mt-3 small text-muted">* In production, this would be an interactive Gantt chart</p>
        </div>
    `;
    
    // Add some basic styling for our mock timeline
    const style = document.createElement('style');
    style.textContent = `
        .timeline-chart {
            width: 100%;
            padding: 10px 0;
        }
        .timeline-bar {
            height: 30px;
            border-radius: 4px;
            color: white;
            display: flex;
            align-items: center;
            padding-left: 10px;
            font-size: 12px;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Render team velocity chart
 */
function renderTeamVelocity() {
    const velocityElement = document.querySelector('.velocity-placeholder');
    
    // Only proceed if element exists on the current page
    if (!velocityElement) return;
    
    // In a real app, you would use a charting library
    velocityElement.innerHTML = `
        <div class="text-center">
            <p class="mb-3">Team Velocity (Sample Data)</p>
            <div class="velocity-chart">
                <div class="chart-bars d-flex align-items-end justify-content-between px-4">
                    <div class="chart-bar" style="height: 60px;"></div>
                    <div class="chart-bar" style="height: 80px;"></div>
                    <div class="chart-bar" style="height: 50px;"></div>
                    <div class="chart-bar" style="height: 90px;"></div>
                    <div class="chart-bar" style="height: 85px;"></div>
                    <div class="chart-bar" style="height: 100px;"></div>
                </div>
                <div class="d-flex justify-content-between px-4 mt-1">
                    <small>Sprint 1</small>
                    <small>Sprint 2</small>
                    <small>Sprint 3</small>
                    <small>Sprint 4</small>
                    <small>Sprint 5</small>
                    <small>Sprint 6</small>
                </div>
            </div>
            <p class="mt-3 small text-muted">* In production, this would be an interactive chart</p>
        </div>
    `;
    
    // Add some basic styling for our mock velocity chart
    const style = document.createElement('style');
    style.textContent = `
        .velocity-chart {
            width: 100%;
            padding: 10px 0;
        }
        .chart-bar {
            width: 30px;
            background-color: var(--primary-color);
            border-radius: 4px 4px 0 0;
        }
    `;
    document.head.appendChild(style);
} 