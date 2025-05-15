<template>
  <div class="contact-page">
    <section class="contact-hero">
      <div class="hero-overlay"></div>
      <div class="container py-5 text-center text-white">
        <h1 class="display-4 fw-bold mb-3">CONTACT US</h1>
        <p class="lead mb-0">We're Here to Help</p>
      </div>
    </section>

    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-10">
          <div class="card shadow-sm border-0">
            <div class="card-body p-5">
              <div class="row">
                <div class="col-md-6 mb-5 mb-md-0">
                  <h2 class="fw-bold mb-4 section-heading-dark">Get in Touch</h2>
                  <p class="lead mb-4">
                    We value your feedback and are here to assist you with any questions or concerns. Please use the contact form to get in touch with our team.
                  </p>
                  <div class="d-flex mb-4">
                    <div class="feature-icon-sm rounded-circle me-4">
                      <i class="bi bi-envelope"></i>
                    </div>
                    <div>
                      <h4 class="h5 mb-1">Email</h4>
                      <a href="mailto:support@trackspend.com" class="text-decoration-none">support@trackspend.com</a>
                    </div>
                  </div>
                  <div class="d-flex mb-4">
                    <div class="feature-icon-sm rounded-circle me-4">
                      <i class="bi bi-telephone"></i>
                    </div>
                    <div>
                      <h4 class="h5 mb-1">Phone</h4>
                      <a href="tel:5551234567" class="text-decoration-none">(555) 123-4567</a>
                    </div>
                  </div>
                  <div class="d-flex">
                    <div class="feature-icon-sm rounded-circle me-4">
                      <i class="bi bi-geo-alt"></i>
                    </div>
                    <div>
                      <h4 class="h5 mb-1">Address</h4>
                      <p class="mb-0">1110 S 67th St, Omaha, NE</p>
                    </div>
                  </div>
                </div>

                <div class="col-md-6">
                  <h2 class="fw-bold mb-4 section-heading-dark">Send us a Message</h2>
                  <form @submit.prevent="submitForm">
                    <div class="mb-4">
                      <label for="name" class="form-label fw-semibold">Your Name</label>
                      <input id="name" v-model="form.name" type="text" class="form-control form-control-lg" required />
                    </div>
                    <div class="mb-4">
                      <label for="email" class="form-label fw-semibold">Email</label>
                      <input id="email" v-model="form.email" type="email" class="form-control form-control-lg" required />
                    </div>
                    <div class="mb-4">
                      <label for="message" class="form-label fw-semibold">Message</label>
                      <textarea id="message" v-model="form.message" rows="5" class="form-control form-control-lg" required></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary px-4">Send Message</button>
                  </form>
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
import APIService from '@/http/APIService';
import Swal from 'sweetalert2';

export default {
  name: 'ContactPage',
  data() {
    return {
      form: {
        name: '',
        email: '',
        message: '',
      },
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
  methods: {
    async submitForm() {
      try {
        const emailData = {
          name: this.form.name,
          email: this.form.email,
          message: this.form.message,
        };

        await APIService.sendEmail(emailData);

        await Swal.fire({
          title: 'Message Sent!',
          text:
            'Thank you for your message. We will get back to you as soon as possible.',
          icon: 'success',
          confirmButtonColor: '#6b8068',
        });

        this.form = { name: '', email: '', message: '' };
      } catch (error) {
        console.error('Error sending email:', error);

        await Swal.fire({
          title: 'Error',
          text:
            'An error occurred while sending the message. Please try again later.',
          icon: 'error',
          confirmButtonColor: '#6b8068',
        });
      }
    },
  },
};
</script>

<style scoped>
.contact-page {
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

.contact-hero {
  position: relative;
  overflow: hidden;
  background-image: url('../assets/images/contact-bg.jpg');
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

.contact-hero .container {
  position: relative;
  z-index: 10;
}

.contact-hero h1 {
  font-weight: 900;
  font-size: 3.5rem;
  letter-spacing: -0.02em;
}

.contact-hero p {
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

.team-intro {
  font-size: 1.1rem;
  line-height: 1.7;
  color: #495057;
}

@media (max-width: 1200px) {
  .contact-hero h1 {
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
  .contact-hero {
    padding-top: 6rem;
    padding-bottom: 4rem;
    text-align: center;
  }

  .contact-hero h1 {
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
  .contact-hero h1 {
    font-size: 2rem;
  }

  .contact-hero p {
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
