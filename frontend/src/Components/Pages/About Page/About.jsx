import "bootstrap/dist/css/bootstrap.min.css";

export default function About() {
  return (
    <>
    <div className="bg-dark text-light overflow-hidden">
      <section className="container py-5 text-center text-md-start">
        <div className="row align-items-center gy-4">
          <div className="col-md-6">
            <h1 className="display-5 fw-bold text-info mb-3 text-uppercase">
              About Us
            </h1>
            <p className="lead text-secondary">
              Welcome to RaceiFy — where passion for RC cars meets precision craftsmanship.
              Explore our curated collection of high-performance miniature vehicles and join
              a community of enthusiasts.
            </p>
          </div>
          <div className="col-md-6 text-center">
          </div>
        </div>
      </section>


      <section className="container py-5">
        <div className="row gy-4">
          <div className="col-lg-6">
            <div className="p-4 bg-secondary bg-opacity-10 rounded-4 shadow-sm">
              <h4 className="fw-bold text-info mb-3">Our Mission</h4>
              <p className="text-light opacity-75 mb-0">
                Our mission is to bring the excitement of the racetrack to your hands through
                a curated collection of RC cars. Each model celebrates speed, innovation, and style.
              </p>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="p-4 bg-secondary bg-opacity-10 rounded-4 shadow-sm">
              <h4 className="fw-bold text-info mb-3">Craftsmanship & Quality</h4>
              <p className="text-light opacity-75 mb-0">
                Every vehicle is crafted with attention to detail, ensuring unmatched realism
                for collectors and enthusiasts alike. Quality and authenticity are our top priorities.
              </p>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="p-4 bg-secondary bg-opacity-10 rounded-4 shadow-sm">
              <h4 className="fw-bold text-info mb-3">Community & Passion</h4>
              <p className="text-light opacity-75 mb-0">
                Join a community of dreamers, builders, and racers who live for speed and motion.
                Share your collection, compete in challenges, and celebrate the joy of RC cars.
              </p>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="p-4 bg-secondary bg-opacity-10 rounded-4 shadow-sm">
              <h4 className="fw-bold text-info mb-3">Your Journey</h4>
              <p className="text-light opacity-75 mb-0">
                Whether you’re expanding your collection, hunting rare models, or discovering
                your next favorite car, RaceiFy makes your journey unforgettable. Build your legacy one car at a time.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
    <footer className="bg-black text-center text-secondary py-4">
        <p className="mb-0">
          © {new Date().getFullYear()} RC World — Built for Speed & Passion.
        </p>
      </footer>
    </>
  );
}
