// ==========================================
// CAMERA UTILITY MODULE
// ==========================================
// This is a utility module that can be imported if needed
// Currently NOT used in interview.html (to avoid conflicts)
// interview.js handles camera management directly

class CameraManager {
    constructor(videoElementId) {
        this.videoElement = document.getElementById(videoElementId);
        this.stream = null;
        this.isRunning = false;
    }

    async start() {
        if (this.isRunning) {
            console.warn("Camera already running");
            return;
        }

        try {
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "user",
                    width: { ideal: 640 },
                    height: { ideal: 480 }
                },
                audio: true
            });

            if (this.videoElement) {
                this.videoElement.srcObject = this.stream;
                this.videoElement.play().catch(err => {
                    console.error("Video play error:", err);
                });
                this.isRunning = true;
                console.log("✅ Camera started successfully");
                return true;
            } else {
                console.error("❌ Video element not found");
                return false;
            }

        } catch (error) {
            console.error("❌ Camera Error:", error);
            
            // Provide detailed error messages
            if (error.name === 'NotAllowedError') {
                alert("Camera permission denied. Please allow camera access in your browser settings.");
            } else if (error.name === 'NotFoundError') {
                alert("No camera found on this device.");
            } else if (error.name === 'NotReadableError') {
                alert("Camera is already in use by another application.");
            } else {
                alert("Unable to access camera: " + error.message);
            }
            
            return false;
        }
    }

    stop() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => {
                track.stop();
            });
            this.stream = null;
            this.isRunning = false;
            
            if (this.videoElement) {
                this.videoElement.srcObject = null;
            }
            console.log("✅ Camera stopped");
        }
    }

    isActive() {
        return this.isRunning && this.stream !== null;
    }
}

// Export if using modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CameraManager;
}