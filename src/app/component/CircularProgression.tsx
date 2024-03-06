import React, { useEffect, useRef, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";

const CircularProgression = ({ serviceTab, index, marks }: {
  serviceTab: any[];
  index: number;
  marks: number; // Accept marks as a prop
}) => {
  const [percentages, setPercentages] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | number | null>(null); // Update type

  useEffect(() => {
    if (containerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && percentages < marks) {
              if (intervalRef.current !== null) { // Check if intervalRef.current is not null
                clearInterval(intervalRef.current as NodeJS.Timeout);
              }
              intervalRef.current = setInterval(() => {
                setPercentages(prevPercentage => {
                  const nextPercentage = prevPercentage + 1;
                  return nextPercentage > marks ? marks : nextPercentage;
                });
              }, 50);
            }
          });
        },
        { threshold: 0 }
      );

      observerRef.current.observe(containerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (intervalRef.current !== null) { // Check if intervalRef.current is not null
        clearInterval(intervalRef.current as NodeJS.Timeout);
      }
    };
  }, [marks]);

  // Update percentages state only when the new marks are less than the current percentage
  useEffect(() => {
    if (marks < percentages) {
      setPercentages(marks);
    }
  }, [marks]);

  return (
    <div ref={containerRef} className="m-10">
      <CircularProgressbar
        styles={buildStyles({
          rotation: 0.25,
          strokeLinecap: 'butt', // Round or butt
          pathTransitionDuration: 0.5,
          pathColor: `url(#gradient-${index})`, // Use gradient for pathColor
          textColor: '#f88',
          trailColor: '#d6d6d6',
          backgroundColor: '#3e98c7',
        })}
        value={percentages}
        text={`${percentages}%`}
      />
       <svg style={{ width: 0, height: 0, position: 'absolute' }}>
        <defs>
          <linearGradient id={`gradient-${index}`} gradientTransform="rotate(90)">
            <stop offset="0%" stopColor="#ff0000" />
            <stop offset="25%" stopColor="#ff8000" />
            <stop offset="50%" stopColor="#ffff00" />
            <stop offset="75%" stopColor="#80ff00" />
            <stop offset="100%" stopColor="#00ff00" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default CircularProgression;
