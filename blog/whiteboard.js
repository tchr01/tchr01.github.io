document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('whiteboard');
    const ctx = canvas.getContext('2d');
    const clearBtn = document.getElementById('clear-board');
    
    // Resize canvas to fit container
    function resizeCanvas() {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
    }
    
    // Initial resize
    resizeCanvas();
    
    // Resize on window resize
    window.addEventListener('resize', resizeCanvas);
    
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    
    function startDrawing(e) {
        isDrawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }
    
    function draw(e) {
        if (!isDrawing) return;
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }
    
    function stopDrawing() {
        isDrawing = false;
    }
    
    function clearBoard() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    // Drawing settings
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    
    // Event listeners
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    clearBtn.addEventListener('click', clearBoard);
    
    // Download functionality
    const downloadBtn = document.getElementById('download-board');
    downloadBtn.addEventListener('click', () => {
        // Create a new canvas with white background
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        
        // Fill with white background
        tempCtx.fillStyle = 'white';
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        
        // Draw the original canvas content
        tempCtx.drawImage(canvas, 0, 0);
        
        // Add URL and date
        const currentDate = new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        tempCtx.fillStyle = '#666';
        tempCtx.font = '10px Arial';
        tempCtx.textAlign = 'center';
        tempCtx.fillText(`Created at https://tchr01.github.io/blog/ on ${currentDate}`, 
            tempCanvas.width / 2, 
            tempCanvas.height - 10
        );
        
        // Convert to data URL and download
        const dataURL = tempCanvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'whiteboard_drawing.png';
        link.href = dataURL;
        link.click();
    });
});
