import { useEffect, useRef } from "react";
import "./App.css";

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    // **Clear canvas visually on refresh**
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const savedImage = localStorage.getItem("savedDrawing");

    if (savedImage) {
      console.log("Image saved in localStorage but not displayed yet.");
    }

    const startDrawing = () => {
      drawingRef.current = true;
    };

    const stopDrawing = () => {
      drawingRef.current = false;
      ctx.beginPath();
      const dataURL = canvas.toDataURL();
      localStorage.setItem("savedDrawing", dataURL);
    };

    const draw = (e: MouseEvent) => {
      if (!drawingRef.current || !ctx) return;

      ctx.lineWidth = 5;
      ctx.lineCap = "round";
      ctx.strokeStyle = "black";

      ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    };

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mousemove", draw);

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mousemove", draw);
    };
  }, []);

  // Function to restore the saved drawing
  const restoreDrawing = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const savedImage = localStorage.getItem("savedDrawing");

    if (savedImage && ctx) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = savedImage;
    }
  };

  // Function to clear the canvas completely
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      localStorage.removeItem("savedDrawing"); // Remove saved drawing
    }
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        style={{ backgroundColor: "white", border: "1px solid black" }}
      />
      <br />
      <button onClick={restoreDrawing}>Restore Last Drawing</button>
      <button onClick={clearCanvas}>Clear Canvas</button>
    </>
  );
}

export default App;
