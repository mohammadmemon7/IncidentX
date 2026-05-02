(function() {
  const scriptTag = document.currentScript;
  const serverUrl = scriptTag.getAttribute('data-server') || 'http://localhost:10001';
  
  const badgeContainer = document.createElement('div');
  badgeContainer.style.display = 'inline-flex';
  badgeContainer.style.alignItems = 'center';
  badgeContainer.style.gap = '8px';
  badgeContainer.style.padding = '6px 12px';
  badgeContainer.style.borderRadius = '9999px';
  badgeContainer.style.fontFamily = 'system-ui, -apple-system, sans-serif';
  badgeContainer.style.fontSize = '12px';
  badgeContainer.style.fontWeight = '600';
  badgeContainer.style.textDecoration = 'none';
  badgeContainer.style.border = '1px solid #e2e8f0';
  badgeContainer.style.backgroundColor = '#ffffff';
  badgeContainer.style.color = '#334155';
  badgeContainer.style.cursor = 'pointer';
  badgeContainer.style.transition = 'all 0.2s';
  
  const statusIndicator = document.createElement('div');
  statusIndicator.style.width = '8px';
  statusIndicator.style.height = '8px';
  statusIndicator.style.borderRadius = '50%';
  
  const statusText = document.createElement('span');
  statusText.innerText = 'Checking status...';
  
  badgeContainer.appendChild(statusIndicator);
  badgeContainer.appendChild(statusText);
  
  badgeContainer.addEventListener('mouseenter', () => {
    badgeContainer.style.backgroundColor = '#f8fafc';
  });
  badgeContainer.addEventListener('mouseleave', () => {
    badgeContainer.style.backgroundColor = '#ffffff';
  });
  badgeContainer.addEventListener('click', () => {
    window.open(serverUrl.replace('/api', '') + '/status', '_blank');
  });

  scriptTag.parentNode.insertBefore(badgeContainer, scriptTag);

  fetch(`${serverUrl}/api/status/public`)
    .then(res => res.json())
    .then(data => {
      if (data.overallStatus === 'operational') {
        statusIndicator.style.backgroundColor = '#22c55e'; // Green
        statusIndicator.style.boxShadow = '0 0 0 2px rgba(34, 197, 94, 0.2)';
        statusText.innerText = 'All Systems Operational';
      } else if (data.overallStatus === 'degraded') {
        statusIndicator.style.backgroundColor = '#eab308'; // Yellow
        statusIndicator.style.boxShadow = '0 0 0 2px rgba(234, 179, 8, 0.2)';
        statusText.innerText = 'Degraded Performance';
      } else {
        statusIndicator.style.backgroundColor = '#ef4444'; // Red
        statusIndicator.style.boxShadow = '0 0 0 2px rgba(239, 68, 68, 0.2)';
        statusText.innerText = 'Major Outage';
      }
    })
    .catch(() => {
      statusIndicator.style.backgroundColor = '#94a3b8'; // Gray
      statusText.innerText = 'Status Unavailable';
    });
})();
