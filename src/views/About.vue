<template>
  <div class="about-page">
    <section class="about-hero">
      <div class="hero-overlay"></div>
      <div class="container py-5 text-center text-white">
        <h1 class="display-4 fw-bold mb-3">ABOUT TRACKSPEND</h1>
        <p class="lead mb-0">Smart finance management made simple</p>
      </div>
    </section>

    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-10">
          <div class="card shadow-sm mb-5 border-0">
            <div class="card-body p-5">
              <div class="row align-items-center">
                <div class="col-md-12 mb-4 mb-md-0">
                  <h2 class="fw-bold mb-4 section-heading-dark">Our Mission</h2>
                  <p class="lead">
                    We believe financial management should be accessible to everyone. TrackSpend helps you take control of your money without complex spreadsheets or expensive software. Our mission is to empower individuals to achieve financial wellness through intuitive and user-friendly tools. We strive to simplify the process of tracking expenses, creating budgets, and analyzing spending, making it easy for anyone to gain a clear understanding of their financial situation and make informed decisions.
                  </p>
                  <div class="mission-statement mt-4">
                    <h4 class="mission-title">Our Core Values</h4>
                    <p class="mission-intro">
                      At TrackSpend, we are dedicated to providing a seamless and empowering experience. These core values guide our work and define how we interact with our users and approach financial management.
                    </p>
                    <div class="row g-4">
                      <div class="col-md-4" v-for="(value, index) in coreValues" :key="index">
                        <div class="core-value-card card h-100">
                          <div class="card-body d-flex flex-column align-items-center justify-content-center">
                            <div class="core-value-icon rounded-circle mb-3">
                              <i :class="value.icon"></i>
                            </div>
                            <h5 class="card-title core-value-title">{{ value.title }}</h5>
                            <p class="card-text core-value-text">
                              {{ value.description }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="card shadow-sm mb-5 border-0">
            <div class="card-body p-5">
              <h2 class="fw-bold mb-4 text-center section-heading-dark">Key Features</h2>
              <div class="row g-4">
                <div class="col-md-6" v-for="(feature, index) in features" :key="index">
                  <div class="d-flex align-items-start">
                    <div class="feature-icon-sm rounded-circle me-4 feature-icon">
                      <i :class="feature.icon"></i>
                    </div>
                    <div>
                      <h4 class="mb-2 feature-title">{{ feature.title }}</h4>
                      <p class="mb-0 feature-text">{{ feature.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="card shadow-sm border-0">
            <div class="card-body p-5">
              <h2 class="fw-bold mb-5 text-center section-heading-dark">Meet The Team</h2>
              <p class="team-intro text-center mb-4">
                Behind TrackSpend is a dedicated team of professionals passionate about creating innovative solutions for personal finance.  We bring together expertise in software development, design, and financial management to deliver a tool that empowers users to achieve their financial goals.
              </p>
              <div class="row g-4">
                <div class="col-md-4" v-for="(member, index) in team" :key="index">
                  <div class="team-member text-center p-4">
                    <img
                      :src="member.image"
                      :alt="member.name"
                      class="team-avatar mb-3"
                    >
                    <h3 class="h5 mb-2 team-name">{{ member.name }}</h3>
                    <p class="text-muted mb-0 team-position">{{ member.position }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutPage',
  data() {
    return {
      features: [
        {
          icon: 'bi bi-graph-up',
          title: 'Expense Tracking',
          description:
            'Monitor your spending as it happens with our intuitive dashboard.  Gain insights into your financial habits and identify areas where you can optimize your spending.',
        },
        {
          icon: 'bi bi-wallet2',
          title: 'Budget Management',
          description:
            'Create personalized budgets that align with your financial goals. Set spending limits for various categories and track your progress in real-time.',
        },
        {
          icon: 'bi bi-pie-chart',
          title: 'Spending Analytics',
          description:
            'Visualize your financial data with interactive charts and reports.  Understand your spending patterns and make informed decisions to improve your financial health.',
        },
        {
          icon: 'bi bi-shield-lock',
          title: 'Secure Cloud Sync',
          description:
            'Your data is protected with industry-leading security measures and accessible across all your devices.  Enjoy peace of mind knowing your information is safe and secure.',
        },
      ],
      team: [
        {
          name: 'Leo Torres',
          position: 'Founder & Lead Developer',
          image: require('@/assets/images/leo.jpg'),
        },
        {
          name: 'Patrice Virata',
          position: 'Application Architect',
          image: require('@/assets/images/patrice.jpg'),
        },
        {
          name: 'Félix Scherer',
          position: 'Application Developer',
          image: require('@/assets/images/felix.jpg'),
        },
      ],
      coreValues: [
        {
          title: 'Empowerment',
          description:
            'We empower you with the knowledge and tools to make informed financial decisions.',
          icon: 'bi bi-lightbulb',
        },
        {
          title: 'Accessibility',
          description:
            'We believe that financial tools should be intuitive and easy to use for everyone.',
          icon: 'bi bi-universal-access',
        },
        {
          title: 'Innovation',
          description:
            'We are committed to continuously improving our platform and providing cutting-edge solutions.',
          icon: 'bi bi-rocket',
        },
      ],
    };
  },
};
</script>

<style scoped>
.about-page {
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

.about-hero {
  position: relative;
  overflow: hidden;
  background-image: url('../assets/images/about-us.jpg');
  background-size: cover;
  background-position: center;
  color: white;
  padding-top: 8rem;
  padding-bottom: 6rem;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0.7;
}

.about-hero .container {
  position: relative;
  z-index: 10;
}

.about-hero h1 {
  font-weight: 900;
  font-size: 3.5rem;
  letter-spacing: -0.02em;
}

.about-hero p {
  font-size: 1.3rem;
}

.section-heading-dark {
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 4rem !important;
  color: #2c463f;
  text-align: center;
}

.feature-icon-lg {
  width: 150px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: #c76d32;
  background-color: #f8f9fa;
  border-radius: 50%;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.08);
}

.mission-icon {
  background-color: rgba(107, 128, 104, 0.1);
  color: #6b8068;
}

.feature-icon-sm {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
  color: #c76d32;
  background-color: #f8f9fa;
  border-radius: 50%;
}

.feature-title {
  color: #2c463f;
  font-weight: 700;
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
}

.feature-text {
  color: #495057;
  font-size: 1.1rem;
  line-height: 1.7;
}

.team-avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #c76d32;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
}

.team-avatar:hover {
  transform: scale(1.05);
}

.team-member {
  transition: transform 0.3s ease;
}

.team-member:hover {
  transform: translateY(-5px);
}

.team-name {
  color: #2c463f;
  font-weight: 700;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.team-position {
  color: #6c757d;
  font-size: 1rem;
}

.card {
  border-radius: 0.75rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: none;
}

.card:hover {
  transform: translateY(-0.5rem);
  box-shadow: 0 0.75rem 1.5rem rgba(0, 0, 0, 0.08);
}

.mission-statement {
  margin-top: 2rem;
}

.mission-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c463f;
  margin-bottom: 1.5rem;
  text-align: center;
}

.mission-intro {
  font-size: 1.1rem;
  line-height: 1.7;
  color: #495057;
  margin-bottom: 1.5rem;
  text-align: center;
}

.core-values-list {
  list-style: none;
  padding-left: 0;
  margin-bottom: 0;
}

.core-values-list .core-value-item {
  font-size: 1.1rem;
  line-height: 1.7;
  color: #495057;
  margin-bottom: 1.25rem;
  padding-left: 0;
  position: relative;
}

.core-values-list .core-value-item:last-child {
  margin-bottom: 0;
}

.core-values-list .core-value-item::before {
  content: '•';
  color: #c76d32;
  margin-right: 0.5rem;
}

.core-values-list .core-value-title {
  font-weight: 700;
  color: #2c463f;
  display: inline-block;
  margin-right: 0.25rem;
}

.core-value-card {
  border-radius: 0.75rem;
  background-color: #f8f9fa;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

.core-value-card:hover {
  transform: translateY(-0.5rem);
  box-shadow: 0 0.75rem 1.5rem rgba(0, 0, 0, 0.08);
}

.core-value-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  background-color: #c76d32;
  color: white;
  font-size: 2.5rem;
}

.core-value-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2c463f;
  margin-bottom: 1rem;
}

.core-value-text {
  font-size: 1.1rem;
  line-height: 1.7;
  color: #495057;
}

.team-intro{
  font-size: 1.1rem;
  line-height: 1.7;
  color: #495057;
}

@media (max-width: 1200px) {
  .about-hero h1 {
    font-size: 3rem;
  }

  .section-heading-dark {
    font-size: 2.2rem;
  }

  .feature-text {
    font-size: 1rem;
  }

  .team-name {
    font-size: 1.1rem;
  }

  .team-position {
    font-size: 0.95rem;
  }
}

@media (max-width: 992px) {
  .about-hero {
    padding-top: 6rem;
    padding-bottom: 4rem;
    text-align: center;
  }

  .about-hero h1 {
    font-size: 2.5rem;
  }

  .section-heading-dark {
    font-size: 2rem;
    margin-bottom: 3rem !important;
  }

  .feature-icon-lg {
    width: 120px;
    height: 120px;
    font-size: 3rem;
  }

  .feature-title {
    font-size: 1.1rem;
  }

  .feature-text {
    font-size: 0.95rem;
  }

  .team-avatar {
    width: 130px;
    height: 130px;
  }

  .team-name {
    font-size: 1rem;
  }

  .team-position {
    font-size: 0.9rem;
  }

  .core-value-card {
    padding: 1.5rem;
  }
}

@media (max-width: 768px) {
  .about-hero h1 {
    font-size: 2rem;
  }

  .about-hero p {
    font-size: 1.2rem;
  }

  .section-heading-dark {
    font-size: 1.8rem;
    margin-bottom: 2.5rem !important;
  }

  .feature-icon-lg {
    width: 100px;
    height: 100px;
    font-size: 2.5rem;
  }

  .feature-icon-sm {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }

  .feature-title {
    font-size: 1rem;
  }

  .feature-text {
    font-size: 0.9rem;
  }

  .team-avatar {
    width: 120px;
    height: 120px;
  }

  .team-name {
    font-size: 0.9rem;
  }

  .team-position {
    font-size: 0.85rem;
  }

  .mission-statement {
    padding: 1.5rem;
  }

  .mission-title {
    font-size: 1.25rem;
  }

  .mission-intro {
    font-size: 0.95rem;
    text-align: left;
  }

  .core-values-list .core-value-item {
    font-size: 0.95rem;
  }

  .core-values-list .core-value-item::before {
    font-size: 0.9rem;
  }

  .core-value-card {
    padding: 1rem;
  }

  .core-value-icon {
    width: 60px;
    height: 60px;
    font-size: 2rem;
  }

  .core-value-title {
    font-size: 1rem;
  }

  .core-value-text {
    font-size: 0.9rem;
  }
}
</style>
