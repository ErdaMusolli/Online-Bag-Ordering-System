import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {
  return (
    <div className="container-fluid px-0 min-vh-100 d-flex justify-content-center align-items-center bg-light" style={{ overflowX: 'hidden', width: '100vw' }}>
      <div className="row w-100 justify-content-center align-items-center text-center">
        <div className="col-md-3">
          <img src="/home1.jpg" alt="Image 1" className="img-fluid" />
        </div>
        <div className="col-md-6">
          <p className="lead">"Where function meets fashion"</p>
          <p className="h3">GET YOUR 100% ORGANIC BAG</p>
          <div className="mt-4">
            <a href="/store" className="btn btn-dark btn-lg">SHOP NOW</a>
          </div>
        </div>
        <div className="col-md-3">
          <img src="/home2.jpg" alt="Image 2" className="img-fluid" />
        </div>
      </div>
    </div>
  );
}
