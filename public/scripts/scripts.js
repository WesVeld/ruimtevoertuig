/**
 * Updates the UI with current spacecraft status
 * Fetches status from server and updates DOM elements
 */
function updateStatus() {
    fetch('/status')
        .then(response => response.json())
        .then(data => {
            // Update all status indicators in the UI
            document.getElementById('batteryStatus').textContent = data.batteryPercentage;
            document.getElementById('sensorList').textContent = data.activeSensors.join(', ');
            document.getElementById('resourceList').textContent = data.discoveredResources.join(', ');
            document.getElementById('movementStatus').textContent = data.movement;
            document.getElementById('sleepStatus').textContent = data.sleepMode ? 'Sleeping' : 'Active';
            document.getElementById('tempStatus').textContent = data.temperature;
            // Show notification for newly discovered resources
            if (data.lastResource) {
                showNotification(`New resource discovered: ${data.lastResource}!`, 'success');
                data.lastResource = null;
            }
        });
}
/**
 * Executes spacecraft actions based on user input
 */
function executeAction(actionCommand) {
    const actionType = actionCommand || document.getElementById('actionSelect').value;
    const actionDetails = document.getElementById('actionDetails')?.value || '';
    // Validate action selection

    if (!actionType) {
        showNotification('Please select an action', 'error');
        return;
    }
    // Send action request to server

    fetch('/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionType, actionDetails })
    })
        .then(response => response.json())
        .then(data => {
            updateStatus();
            showNotification(`${actionType === 'recharge' ? 'Battery recharged!' : 'Action executed successfully!'}`, 'success');
            document.getElementById('actionDetails').value = '';
            document.getElementById('actionSelect').value = '';
        })
        .catch(error => {
            showNotification('Failed to execute action', 'error');
        });
}
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

updateStatus();
setInterval(updateStatus, 5000);
