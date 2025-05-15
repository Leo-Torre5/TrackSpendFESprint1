<template>
  <div class="home-content">
    <section class="hero">
      <div class="hero-overlay"></div>
      <div class="container">
        <div class="row flex-lg-row-reverse align-items-center g-5">
          <div class="col-10 col-sm-8 col-lg-6 mx-auto">
          </div>
          <div class="col-lg-6 text-center text-lg-start">
            <h1 class="display-4 fw-bold lh-1 mb-3" style="color: white;">
              Take Control of Your Finances
            </h1>
            <p class="lead mb-4" style="color: rgba(255, 255, 255, 0.8);">
              TrackSpend empowers you to manage your money with ease.  From detailed expense tracking to insightful budgeting, we provide the tools you need to achieve financial wellness.
            </p>
            <p class="lead mb-5" style="color: rgba(255, 255, 255, 0.8);">
              Start your journey towards financial clarity today.
            </p>
            <div class="d-grid gap-2 d-md-flex justify-content-md-start">
              <router-link to="/register" class="btn btn-lg px-4 me-md-2 primary-button">Get Started</router-link>
              <router-link to="/about" class="btn btn-outline-light btn-lg px-4 secondary-button">Learn More</router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="container py-5">
      <h2 class="pb-2 text-center section-heading">KEY FEATURES</h2>
      <div class="row g-4 py-5 row-cols-1 row-cols-lg-3">
        <div class="feature col">
          <div class="feature-icon">
            <i class="bi bi-cash-stack"></i>
          </div>
          <h3>Expense Tracking</h3>
          <p>
            Effortlessly record your income and expenses.  Categorize transactions, add notes, and visualize your spending patterns with interactive charts.  Gain a clear understanding of where your money goes.
          </p>
          <router-link to="/expenses/" class="icon-link">
            Track Expenses
            <i class="bi bi-arrow-right"></i>
          </router-link>
        </div>

        <div class="feature col">
          <div class="feature-icon">
            <i class="bi bi-graph-up"></i>
          </div>
          <h3>Budgeting Tools</h3>
          <p>
            Create personalized budgets that align with your financial goals.  Set spending limits for various categories, track your progress, and receive timely notifications to stay on track.
          </p>
          <router-link to="/budgets/" class="icon-link">
            Create Budgets
            <i class="bi-arrow-right"></i>
          </router-link>
        </div>

        <div class="feature col">
          <div class="feature-icon">
            <i class="bi bi-shield-lock"></i>
          </div>
          <h3>Security First</h3>
          <p>
            Your financial data is protected with advanced encryption and security measures.  We employ industry-leading practices to ensure your information remains private and secure.
          </p>
          <router-link to="/privacy" class="icon-link">
            Learn about Security
            <i class="bi bi-arrow-right"></i>
          </router-link>
        </div>
      </div>
    </section>

    <section class="bg-light py-5">
      <div class="container">
        <h2 class="text-center section-heading">HOW IT WORKS</h2>
        <div class="row g-4">
          <div class="col-md-4">
            <div class="step-card p-4 text-center shadow-sm rounded-3 h-100">
              <div class="step-number">1</div>
              <h3>Sign Up</h3>
              <p>
                Create your free TrackSpend account in minutes.  Provide basic information and set up your profile to get started.
              </p>
              <router-link to="/register" class="btn btn-outline-secondary rounded-pill">Get Started</router-link>
            </div>
          </div>
          <div class="col-md-4">
            <div class="step-card p-4 text-center shadow-sm rounded-3 h-100">
              <div class="step-number">2</div>
              <h3>Expense Tracking</h3>
              <p>
                Effortlessly manage your finances by logging expenses. Record essential details like amount, category, date, and description. 
              </p>
              <router-link to="/expenses/" class="btn btn-outline-secondary rounded-pill">Add Expenses</router-link>
            </div>
          </div>
          <div class="col-md-4">
            <div class="step-card p-4 text-center shadow-sm rounded-3 h-100">
              <div class="step-number">3</div>
              <h3>Track & Analyze</h3>
              <p>
                Monitor your finances, analyze your spending habits, and create budgets to achieve your financial goals.
              </p>
              <router-link to="/budgets/" class="btn btn-outline-secondary rounded-pill">Set Budget</router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="container py-5">
      <h2 class="text-center section-heading">WHAT OUR USERS ARE SAYING</h2>
      <div class="row">
        <div class="col-lg-4 mb-4">
          <div class="card shadow-sm h-100">
            <div class="card-body text-center p-4">
              <div class="testimonial-avatar">
                <img src="@/assets/images/user1.jpeg" alt="User 1" class="rounded-circle">
              </div>
              <p class="card-text">
                "TrackSpend has revolutionized the way I manage my finances.  The insights I've gained are invaluable, and I'm now saving more than ever before!"
              </p>
              <h5 class="card-title mb-1">Sandy S.</h5>
              <p class="text-muted small">Marketing Manager</p>
            </div>
          </div>
        </div>
        <div class="col-lg-4 mb-4">
          <div class="card shadow-sm h-100">
            <div class="card-body text-center p-4">
              <div class="testimonial-avatar">
                <img src="@/assets/images/user2.jpeg" alt="User 2" class="rounded-circle">
              </div>
              <p class="card-text">
                "I love the budgeting feature!  It's so easy to set up and track my progress.  TrackSpend has helped me take control of my spending and plan for the future."
              </p>
              <h5 class="card-title mb-1">Pierce L.</h5>
              <p class="text-muted small">Software Engineer</p>
            </div>
          </div>
        </div>
        <div class="col-lg-4 mb-4">
          <div class="card shadow-sm h-100">
            <div class="card-body text-center p-4">
              <div class="testimonial-avatar">
                <img src="@/assets/images/user3.jpeg" alt="User 3" class="rounded-circle">
              </div>
              <p class="card-text">
                "As a project manager, I need to keep a close eye on my finances.  TrackSpend provides the clarity and security I need to manage my money effectively."
              </p>
              <h5 class="card-title mb-1">Hamza A.</h5>
              <p class="text-muted small">Project Manager</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-section py-5 text-white">
      <div class="container text-center">
        <h2 class="display-5 mb-4">Ready to Transform Your Finances?</h2>
        <p class="lead mb-4">
          Join thousands of users who are already achieving their financial goals with TrackSpend.  Sign up today and experience the difference!
        </p>
        <div class="d-grid gap-2 d-sm-flex justify-content-sm-center">
          <router-link to="/register" class="btn btn-lg px-4 gap-3 rounded-pill primary-button">Sign Up Now</router-link>
          <router-link to="/contact" class="btn btn-outline-light btn-lg px-4 rounded-pill secondary-button">Contact Us</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HomePage'
}
</script>

<style scoped>
.home-content {
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

.hero {
  position: relative;
  overflow: hidden;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('../assets/images/Calculator.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  color: white;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  opacity: 0.6;
}

.hero .container {
  position: relative;
  z-index: 10;
  padding-top: 4rem;
  padding-bottom: 4rem;
  text-align: center;
}

.hero-title {
  font-weight: 900;
  font-size: 3rem;
  letter-spacing: -0.02em;
}

.hero-paragraph{
  font-size: 1.1rem;
}


.hero-cta .btn {
  font-weight: 600;
  border-radius: 0.5rem;
  padding: 1rem 2rem;
  font-size: 1.1rem;
}

.primary-button {
  background-color: #c76d32 !important;
  color: white !important;
  border: none !important;
}

.primary-button:hover {
  background-color: #a7581e !important;
}

.secondary-button {
  color: white;
  border: 2px solid white;
}

.secondary-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: white;
}


.section-heading {
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 4rem !important;
  color: #2c463f;
  text-align: center;
}

.feature {
  text-align: center;
  padding: 2rem;
  border-radius: 0.75rem;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  background-color: #f8f9fa;
}

.feature:hover {
  transform: translateY(-0.5rem);
  box-shadow: 0 0.75rem 1.5rem rgba(0, 0, 0, 0.08);
}


.feature-icon {
  background-color: transparent !important;
  color: #c76d32 !important;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1.5rem;
}

.feature-icon i {
  font-size: 3rem;
}

.feature h3 {
  color: #2c463f;
  margin-bottom: 1.2rem !important;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 1.5rem;
  letter-spacing: 0.05em;
}

.feature p {
  color: #495057;
  font-size: 1.1rem;
  line-height: 1.7;
  margin-bottom: 2rem;
}

.icon-link {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  font-weight: 600;
  color: #c76d32;
  font-size: 1.1rem;
  transition: color 0.2s ease-in-out;
}

.icon-link:hover {
  text-decoration: underline;
  color: #a7581e;
}

.icon-link i {
  margin-left: 0.5rem;
  transition: transform 0.2s ease-in-out;
}

.icon-link:hover i {
  transform: translateX(0.2rem);
}

.bg-light {
  background-color: #f8f9fa !important;
}

.bg-light > .container > h2 {
  margin-bottom: 3rem !important;
}

.step-card {
  background-color: white;
  border-radius: 0.75rem;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  padding: 2rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.step-card:hover {
  transform: translateY(-0.5rem);
  box-shadow: 0 0.75rem 1.5rem rgba(0, 0, 0, 0.08);
}

.step-number {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  border-radius: 50%;
  margin: 0 auto 1.5rem;
  background-color: #c76d32;
  color: white;
}

.step-card h3 {
  color: #2c463f;
  font-weight: 700;
  font-size: 1.25rem;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.step-card p {
  color: #495057;
  font-size: 1.1rem;
  line-height: 1.7;
  margin-bottom: 2rem;
  flex-grow: 1;
}

.step-card .btn-outline-secondary {
  color: #c76d32;
  border-color: #c76d32;
  font-weight: 600;
  font-size: 1.1rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.step-card .btn-outline-secondary:hover {
  background-color: #c76d32;
  color: white;
  border-color: #c76d32;
}



.container.py-5:nth-child(4) > h2 {
  margin-bottom: 3rem !important;
}

.card {
  border: none;
  border-radius: 0.75rem;
  transition:  box-shadow 0.3s ease;
}

.card:hover{
   box-shadow: 0 0.75rem 1.5rem rgba(0, 0, 0, 0.08);
}

.testimonial-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
}

.testimonial-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-text {
  color: #495057;
  font-size: 1.1rem;
  line-height: 1.7;
  margin-bottom: 1.5rem;
  font-style: italic;
}

.card-title {
  color: #2c463f;
  font-weight: 700;
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
}

.card .text-muted {
  font-size: 0.9rem;
  color: #6c757d;
}

.cta-section {
  background-color: #2c463f;
  padding: 4rem 0;
  margin-top: 4rem;
}

.cta-section h2 {
  font-size: 3rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: white;
  margin-bottom: 1.5rem;
}

.cta-section p {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .hero {
    padding-top: 3rem;
    padding-bottom: 3rem;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .section-heading {
    font-size: 2.2rem;
  }

  .feature h3 {
    font-size: 1.2rem;
  }

  .step-number {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }

  .cta-section h2 {
    font-size: 2.5rem;
  }
}


@media (max-width: 992px) {
  .hero {
    min-height: auto;
    padding-top: 2rem;
    padding-bottom: 2rem;
    text-align: center;
  }

  .hero-title {
    font-size: 2.2rem;
  }

  .hero-cta {
    flex-direction: column;
    align-items: center;
  }

  .hero-cta .btn {
    margin-bottom: 1rem;
  }

  .section-heading {
    font-size: 2rem;
    margin-bottom: 3rem !important;
  }

  .feature {
    padding: 1.5rem;
  }

  .feature h3 {
    font-size: 1.1rem;
  }

  .feature p {
    font-size: 1rem;
  }

   .icon-link {
    font-size: 1rem;
  }

  .step-card {
    padding: 1.5rem;
  }

  .step-card h3 {
    font-size: 1.1rem;
  }

  .step-card p {
    font-size: 1rem;
  }

  .cta-section h2 {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .section-heading {
    font-size: 1.8rem;
  }

  .feature {
    text-align: center;
  }

  .feature-icon {
    margin-bottom: 1rem;
  }

  .feature h3 {
    font-size: 1.2rem;
  }

  .feature p {
    font-size: 0.95rem;
  }

  .icon-link {
    font-size: 0.9rem;
  }

  .step-card h3 {
    font-size: 1rem;
  }

  .step-card p {
    font-size: 0.95rem;
  }

  .cta-section h2 {
    font-size: 1.75rem;
  }
  .cta-section p{
    font-size: 1rem;
  }
}
</style>