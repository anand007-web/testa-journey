
import React from 'react';

const HeartLoader = () => {
  return (
    <div className="w-full flex justify-center mb-4">
      <div className="heart-loader">
        <svg className="heart" viewBox="-5 -5 278 56" version="1.1" id="svg5" xmlns="http://www.w3.org/2000/svg">
          <filter>
            <feGaussianBlur stdDeviation="1.6" />
          </filter>
          <g transform="translate(29.1 -127.42)" id="layer1">
            <path pathLength={1} d="M-28.73 167.2c26.43 9.21 68.46-9.46 85.45-12.03 18.45-2.78 32.82 4.86 28.75 9.83-3.82 4.66-25.77-21.18-14.81-31.5 9.54-8.98 17.64 10.64 16.42 17.06-1.51-6.2 2.95-26.6 14.74-22.11 11.7 4.46-4.33 49.03-15.44 44.08-6.97-3.1 15.44-16.26 26.1-16 23.03.56 55.6 27.51 126.63 3.36" id="line" />
          </g>
          <g transform="translate(29.1 -127.42)" id="layer2">
            <path pathLength={1} d="M-28.73 167.2c26.43 9.21 68.46-9.46 85.45-12.03 18.45-2.78 32.82 4.86 28.75 9.83-3.82 4.66-25.77-21.18-14.81-31.5 9.54-8.98 17.64 10.64 16.42 17.06-1.51-6.2 2.95-26.6 14.74-22.11 11.7 4.46-4.33 49.03-15.44 44.08-6.97-3.1 15.44-16.26 26.1-16 23.03.56 55.6 27.51 126.63 3.36" id="point" filter="url(#blur)" />
          </g>
        </svg>
        <style>
          {`
          .heart #line {
            fill: none;
            stroke: #e00000;
            stroke-width: 1.5;
            stroke-linecap: butt;
            stroke-linejoin: round;
            stroke-miterlimit: 4;
            stroke-opacity: 1;
            stroke-dasharray: 1;
            stroke-dashoffset: 1;
            animation: dash 3s linear infinite;
          }
          .heart #point {
            fill: none;
            stroke: #f00000;
            stroke-width: 5;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-miterlimit: 0.1;
            stroke-opacity: 1;
            stroke-dasharray: 0.0001, 0.9999;
            stroke-dashoffset: 1;
            animation: dash 3s linear infinite;
          }
          @keyframes dash {
            0% {
              stroke-dashoffset: 1;
            }
            80% {
              stroke-dashoffset: 0;
            }
            100% {
              stroke-dashoffset: 0;
            }
          }
          `}
        </style>
      </div>
    </div>
  );
}

export default HeartLoader;
