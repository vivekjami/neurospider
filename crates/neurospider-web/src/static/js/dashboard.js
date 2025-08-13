// NeuroSpider Dashboard JavaScript

class Dashboard {
    constructor() {
        this.websocket = null;
        this.charts = {};
        this.init();
    }

    init() {
        this.connectWebSocket();
        this.setupEventListeners();
        this.loadInitialData();
    }

    connectWebSocket() {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws`;
        
        this.websocket = new WebSocket(wsUrl);
        
        this.websocket.onopen = () => {
            console.log('WebSocket connected');
        };
        
        this.websocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.handleWebSocketMessage(data);
        };
        
        this.websocket.onclose = () => {
            console.log('WebSocket disconnected');
            // Reconnect after 5 seconds
            setTimeout(() => this.connectWebSocket(), 5000);
        };
        
        this.websocket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    handleWebSocketMessage(data) {
        switch (data.type) {
            case 'stats_update':
                this.updateStats(data.payload);
                break;
            case 'crawl_update':
                this.updateCrawlList(data.payload);
                break;
            case 'metrics_update':
                this.updateMetrics(data.payload);
                break;
        }
    }

    setupEventListeners() {
        const newCrawlBtn = document.getElementById('new-crawl-btn');
        if (newCrawlBtn) {
            newCrawlBtn.addEventListener('click', () => this.showNewCrawlDialog());
        }

        const timeRangeSelector = document.getElementById('time-range');
        if (timeRangeSelector) {
            timeRangeSelector.addEventListener('change', (e) => {
                this.updateTimeRange(e.target.value);
            });
        }
    }

    async loadInitialData() {
        try {
            const response = await fetch('/api/dashboard/stats');
            const stats = await response.json();
            this.updateStats(stats);

            const crawlsResponse = await fetch('/api/crawls');
            const crawls = await crawlsResponse.json();
            this.updateCrawlList(crawls);
        } catch (error) {
            console.error('Failed to load initial data:', error);
        }
    }

    updateStats(stats) {
        const elements = {
            'active-crawls': stats.active_crawls || 0,
            'pages-crawled': stats.pages_crawled || 0,
            'success-rate': `${stats.success_rate || 0}%`,
            'queue-size': stats.queue_size || 0
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    }

    updateCrawlList(crawls) {
        const tbody = document.getElementById('crawl-list-body');
        if (!tbody) return;

        tbody.innerHTML = '';

        crawls.forEach(crawl => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${crawl.id}</td>
                <td>${crawl.url}</td>
                <td><span class="status ${crawl.status.toLowerCase()}">${crawl.status}</span></td>
                <td>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${crawl.progress}%"></div>
                    </div>
                    ${crawl.progress}%
                </td>
                <td>${new Date(crawl.started_at).toLocaleString()}</td>
                <td>
                    <button class="btn btn-sm" onclick="dashboard.viewCrawl('${crawl.id}')">View</button>
                    ${crawl.status === 'running' ? 
                        `<button class="btn btn-sm btn-danger" onclick="dashboard.stopCrawl('${crawl.id}')">Stop</button>` : 
                        ''
                    }
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    showNewCrawlDialog() {
        const url = prompt('Enter URL to crawl:');
        if (url) {
            this.startNewCrawl(url);
        }
    }

    async startNewCrawl(url) {
        try {
            const response = await fetch('/api/crawls', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url: url,
                    config: {
                        max_depth: 3,
                        max_pages: 1000
                    }
                })
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Crawl started:', result);
                this.loadInitialData(); // Refresh data
            } else {
                console.error('Failed to start crawl');
            }
        } catch (error) {
            console.error('Error starting crawl:', error);
        }
    }

    async stopCrawl(crawlId) {
        try {
            const response = await fetch(`/api/crawls/${crawlId}/stop`, {
                method: 'POST'
            });

            if (response.ok) {
                console.log('Crawl stopped:', crawlId);
                this.loadInitialData(); // Refresh data
            } else {
                console.error('Failed to stop crawl');
            }
        } catch (error) {
            console.error('Error stopping crawl:', error);
        }
    }

    viewCrawl(crawlId) {
        window.location.href = `/crawl/${crawlId}`;
    }

    updateTimeRange(range) {
        // Update charts and metrics based on time range
        console.log('Time range changed to:', range);
        // Implement time range filtering
    }

    updateMetrics(metrics) {
        const tbody = document.getElementById('metrics-table-body');
        if (!tbody) return;

        tbody.innerHTML = '';

        metrics.forEach(metric => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${metric.name}</td>
                <td>${metric.current}</td>
                <td>${metric.average}</td>
                <td>${metric.peak}</td>
                <td>
                    <span class="trend ${metric.trend_direction}">
                        ${metric.trend_direction === 'up' ? '↗' : metric.trend_direction === 'down' ? '↘' : '→'}
                        ${metric.trend_percentage}%
                    </span>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
});

// Additional utility functions
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function formatBytes(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}
