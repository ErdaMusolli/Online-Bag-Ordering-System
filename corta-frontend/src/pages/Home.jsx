import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {
  return (
    <div className="container-fluid px-0">
      <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light">
        <div className="d-flex justify-content-center align-items-center gap-4 flex-wrap">
          <div className="img1">
            <img src="/home1.jpg" alt="Image 1" width="300" className="img-fluid" />
          </div>
          <div className="text text-center">
            <p className="lead">"Where function meets fashion"</p>
            <p className="h3">GET YOUR 100% ORGANIC BAG</p>
          </div>
          <div className="img2">
            <img src="/home2.jpg" alt="Image 2" width="300" className="img-fluid" />
          </div>
        </div>

        <div className="text-center mt-5">
          <a href="/store" className="btn btn-dark btn-lg">SHOP NOW</a>
        </div>
      </div>
    </div>
  );
}
