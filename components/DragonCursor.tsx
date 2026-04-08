"use client";

import { useEffect, useRef } from "react";

const NUM_SEGMENTS = 60;
const HEAD_RADIUS = 22;
const TAIL_RADIUS = 2;

type Point = { x: number; y: number };
type Orb = Point & { radius: number; lifeOffset: number };

export default function DragonCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<Point>({ x: -200, y: -200 });
  const segmentsRef = useRef<Point[]>([]);
  const orbsRef = useRef<Orb[]>([]);

  useEffect(() => {
    if (segmentsRef.current.length === 0) {
      for (let i = 0; i < NUM_SEGMENTS; i++) {
        segmentsRef.current.push({ x: -200, y: -200 });
      }
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Pre-spawn some orbs
    for(let i=0; i<8; i++){
      orbsRef.current.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 6 + 4,
        lifeOffset: Math.random() * 100
      });
    }

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    let animationId: number;
    let time = 0;

    const render = () => {
      time += 0.1;
      ctx.clearRect(0, 0, width, height);

      const segments = segmentsRef.current;
      const target = mouseRef.current;
      const orbs = orbsRef.current;

      // --- ORBS LOGIC ---
      if (Math.random() < 0.02 && orbs.length < 15) {
        orbs.push({
           x: Math.random() * width,
           y: Math.random() * height,
           radius: Math.random() * 6 + 4,
           lifeOffset: Math.random() * 100
        });
      }

      for (let i = orbs.length - 1; i >= 0; i--) {
        const orb = orbs[i];
        
        // Float orb slightly
        orb.y -= 0.5;
        orb.x += Math.sin(time * 0.5 + orb.lifeOffset) * 0.5;
        
        // Wrap screen
        if (orb.y < -50) orb.y = height + 50;
        if (orb.x < -50) orb.x = width + 50;
        if (orb.x > width + 50) orb.x = -50;

        // Collision with Head
        const dx = segments[0].x - orb.x;
        const dy = segments[0].y - orb.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < HEAD_RADIUS + orb.radius + 10) {
           // Consume Orb
           orbs.splice(i, 1);
           // Slight target kickback for satisfying "eat" effect
           segments[0].x += dx * 0.1;
           segments[0].y += dy * 0.1;
           continue;
        }

        // Draw Orb
        const pulse = Math.sin(time + orb.lifeOffset) * 0.5 + 0.5; // 0 to 1
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius + pulse*2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + pulse*0.6})`;
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#ffffff";
        ctx.fill();
        
        // Inner core
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius*0.5, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
      }
      ctx.shadowBlur = 0; // reset


      // --- DRAGON LOGIC ---
      // Head dynamics
      segments[0].x += (target.x - segments[0].x) * 0.15;
      segments[0].y += (target.y - segments[0].y) * 0.15;

      // Body dynamics 
      for (let i = 1; i < NUM_SEGMENTS; i++) {
        const dx = segments[i - 1].x - segments[i].x;
        const dy = segments[i - 1].y - segments[i].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const minDist = i < 15 ? 8 : 6; 

        if (distance > minDist) {
          segments[i].x += dx * 0.45;
          segments[i].y += dy * 0.45;
        }
      }

      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Helper function to get angle
      const getAngle = (i: number) => {
        if (i === 0) return Math.atan2(segments[0].y - segments[2].y, segments[0].x - segments[2].x);
        return Math.atan2(segments[i-1].y - segments[i].y, segments[i-1].x - segments[i].x);
      };

      // 1. Draw Tail Fin
      const tailIdx = NUM_SEGMENTS - 1;
      const tailAngle = getAngle(tailIdx);
      ctx.fillStyle = "rgba(139, 0, 0, 0.6)"; // Crimson
      ctx.beginPath();
      ctx.moveTo(segments[tailIdx].x, segments[tailIdx].y);
      ctx.lineTo(
        segments[tailIdx].x - Math.cos(tailAngle - 0.5) * 40,
        segments[tailIdx].y - Math.sin(tailAngle - 0.5) * 40
      );
      ctx.lineTo(
        segments[tailIdx].x - Math.cos(tailAngle) * 50,
        segments[tailIdx].y - Math.sin(tailAngle) * 50
      );
      ctx.lineTo(
        segments[tailIdx].x - Math.cos(tailAngle + 0.5) * 40,
        segments[tailIdx].y - Math.sin(tailAngle + 0.5) * 40
      );
      ctx.fill();

      // 2. Draw Legs
      const drawLeg = (idx: number, isRight: boolean, isBack: boolean) => {
        if (idx >= NUM_SEGMENTS - 1) return;
        const p0 = segments[idx];
        const angle = getAngle(idx);
        const offsetAngle = angle + (isRight ? Math.PI / 2 : -Math.PI / 2);
        
        // Elbow bends backwards for back legs, forwards for front
        const bendDir = isBack ? -1 : 1;
        const elbowX = p0.x + Math.cos(offsetAngle) * 25 - Math.cos(angle) * (15 * bendDir);
        const elbowY = p0.y + Math.sin(offsetAngle) * 25 - Math.sin(angle) * (15 * bendDir);
        
        const footX = elbowX + Math.cos(offsetAngle + (isRight ? -0.5 : 0.5)) * 20;
        const footY = elbowY + Math.sin(offsetAngle + (isRight ? -0.5 : 0.5)) * 20;

        ctx.strokeStyle = "rgba(212, 175, 55, 0.8)";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(elbowX, elbowY);
        ctx.lineTo(footX, footY);
        ctx.stroke();

        // 3 Claws
        ctx.strokeStyle = "#facc15";
        ctx.lineWidth = 2;
        const clawAngle = Math.atan2(footY - elbowY, footX - elbowX);
        for(let j=-1; j<=1; j++) {
          ctx.beginPath();
          ctx.moveTo(footX, footY);
          ctx.lineTo(
            footX + Math.cos(clawAngle + (j*0.4)) * 12,
            footY + Math.sin(clawAngle + (j*0.4)) * 12
          );
          ctx.stroke();
        }
      };
      
      drawLeg(14, true, false);
      drawLeg(14, false, false);
      drawLeg(40, true, true);
      drawLeg(40, false, true);

      // 3. Draw Body & Spines
      for (let i = NUM_SEGMENTS - 2; i > 0; i--) {
        const p0 = segments[i];
        const angle = getAngle(i);
        const radius = TAIL_RADIUS + ((NUM_SEGMENTS - i) / NUM_SEGMENTS) * (HEAD_RADIUS - TAIL_RADIUS);
        const ratio = 1 - (i / NUM_SEGMENTS);
        
        // Body Segment
        ctx.beginPath();
        ctx.arc(p0.x, p0.y, radius, 0, Math.PI * 2);
        
        if (i < 8) {
          ctx.fillStyle = `rgba(250, 204, 21, ${0.7 + (ratio * 0.3)})`; 
          ctx.shadowBlur = 10;
          ctx.shadowColor = "#facc15";
        } else if (i < 35) {
          ctx.fillStyle = `rgba(212, 175, 55, ${ratio + 0.2})`; 
          ctx.shadowBlur = 8;
          ctx.shadowColor = "#d4af37";
        } else {
          ctx.fillStyle = `rgba(139, 0, 0, ${ratio + 0.3})`; 
          ctx.shadowBlur = 4;
          ctx.shadowColor = "#8b0000";
        }
        ctx.fill();
        ctx.shadowBlur = 0; 
        
        // Side Scales / Jagged Spine 
        if (i % 2 === 0) {
          const spineLength = radius * 1.8;
          const leftX = p0.x + Math.cos(angle + Math.PI / 2) * spineLength;
          const leftY = p0.y + Math.sin(angle + Math.PI / 2) * spineLength;
          const rightX = p0.x + Math.cos(angle - Math.PI / 2) * spineLength;
          const rightY = p0.y + Math.sin(angle - Math.PI / 2) * spineLength;
          
          ctx.beginPath();
          ctx.moveTo(leftX, leftY);
          ctx.lineTo(p0.x - Math.cos(angle)*radius, p0.y - Math.sin(angle)*radius);
          ctx.lineTo(rightX, rightY);
          
          let spineColor = i < 15 ? "#facc15" : (i < 35 ? "#d4af37" : "#ff4500");
          ctx.strokeStyle = spineColor;
          ctx.lineWidth = i < 15 ? 4 : 2;
          ctx.stroke();
        }
        
        // Drawing a fiery Mane near the neck
        if (i > 2 && i < 10) {
          const wave = Math.sin(time + i) * 10;
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(
            p0.x + Math.cos(angle + Math.PI/2) * (radius*3 + wave),
            p0.y + Math.sin(angle + Math.PI/2) * (radius*3 + wave)
          );
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(
            p0.x + Math.cos(angle - Math.PI/2) * (radius*3 - wave),
            p0.y + Math.sin(angle - Math.PI/2) * (radius*3 - wave)
          );
          ctx.strokeStyle = "rgba(255, 69, 0, 0.4)";
          ctx.lineWidth = 3;
          ctx.stroke();
        }
      }

      // 4. Draw Distinct Dragon Head
      const head = segments[0];
      const headAngle = getAngle(0);

      ctx.save();
      ctx.translate(head.x, head.y);
      ctx.rotate(headAngle);

      // Head shape 
      ctx.beginPath();
      ctx.moveTo(-10, -15);
      ctx.lineTo(15, -12);
      ctx.lineTo(30, -6);
      ctx.lineTo(30, 6);  
      ctx.lineTo(15, 12);  
      ctx.lineTo(-10, 15); 
      ctx.lineTo(-5, 0);   
      ctx.closePath();
      
      ctx.fillStyle = "#facc15";
      ctx.shadowBlur = 20;
      ctx.shadowColor = "#facc15";
      ctx.fill();
      ctx.strokeStyle = "#b08d00";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Backwards facing horns
      ctx.beginPath();
      ctx.moveTo(-5, -10);
      ctx.quadraticCurveTo(-20, -25, -35, -20);
      ctx.lineTo(-10, -15);
      
      ctx.moveTo(-5, 10);
      ctx.quadraticCurveTo(-20, 25, -35, 20);
      ctx.lineTo(-10, 15);
      ctx.fillStyle = "#ffd700";
      ctx.fill();
      ctx.stroke();

      // Glowing Red Eyes
      ctx.fillStyle = "#ff0000";
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#ff0000";
      ctx.beginPath();
      ctx.arc(10, -8, 4, 0, Math.PI * 2);
      ctx.arc(10, 8, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
      ctx.shadowBlur = 0;

      // 5. Long wavy whiskers
      const wave = Math.sin(time) * 20;
      
      const leftSnoutX = head.x + Math.cos(headAngle) * 30 + Math.cos(headAngle - Math.PI/2) * 6;
      const leftSnoutY = head.y + Math.sin(headAngle) * 30 + Math.sin(headAngle - Math.PI/2) * 6;
      const rightSnoutX = head.x + Math.cos(headAngle) * 30 + Math.cos(headAngle + Math.PI/2) * 6;
      const rightSnoutY = head.y + Math.sin(headAngle) * 30 + Math.sin(headAngle + Math.PI/2) * 6;

      ctx.lineWidth = 2;
      ctx.strokeStyle = "#facc15";
      ctx.beginPath();
      ctx.moveTo(leftSnoutX, leftSnoutY);
      ctx.quadraticCurveTo(
        head.x + Math.cos(headAngle - Math.PI / 1.5) * 80,
        head.y + Math.sin(headAngle - Math.PI / 1.5) * 80 + wave,
        head.x + Math.cos(headAngle - Math.PI) * 110,
        head.y + Math.sin(headAngle - Math.PI) * 110 - wave
      );
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(rightSnoutX, rightSnoutY);
      ctx.quadraticCurveTo(
        head.x + Math.cos(headAngle + Math.PI / 1.5) * 80,
        head.y + Math.sin(headAngle + Math.PI / 1.5) * 80 - wave,
        head.x + Math.cos(headAngle + Math.PI) * 110,
        head.y + Math.sin(headAngle + Math.PI) * 110 + wave
      );
      ctx.stroke();

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none -z-10"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
