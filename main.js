/* ===== Preloader ===== */
window.addEventListener('load', () => {
  setTimeout(() => {
    const pl = document.getElementById('preloader');
    if (pl) {
      pl.style.opacity = '0';
      pl.style.visibility = 'hidden';
    }
  }, 100); // Lightning fast loading
});

/* ===== Custom Cursor ===== */
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0, frameCount = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function curLoop() {
  frameCount++;
  if (frameCount % 2 === 0) { // Update every other frame (30fps instead of 60fps)
    rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
    cur.style.left = mx + 'px'; cur.style.top = my + 'px';
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  }
  requestAnimationFrame(curLoop);
})();
document.querySelectorAll('a,button,.proj-card,.radial-card,.cert-card').forEach(el => {
  el.addEventListener('mouseenter', () => { cur.classList.add('hover'); ring.classList.add('hover'); });
  el.addEventListener('mouseleave', () => { cur.classList.remove('hover'); ring.classList.remove('hover'); });
});



/* ===== Navbar shrink ===== */
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      document.querySelector('nav').classList.toggle('shrink', scrollY > 60);
      ticking = false;
    });
    ticking = true;
  }
});

/* ===== Typing Animation ===== */
const phrases = [
  'Machine Learning Engineer',
  'Data Science Enthusiast',
  'Python Developer',
  'Data Analytics Expert',
  'Building Intelligent Systems'
];
let pi = 0, ci = 0, del = false;
const typer = document.getElementById('typer');
function type() {
  const phrase = phrases[pi];
  typer.textContent = del ? phrase.slice(0, ci--) : phrase.slice(0, ci++);
  if (!del && ci > phrase.length) { del = true; return setTimeout(type, 1200); } // Reduced from 1800ms
  if (del && ci < 0) { del = false; pi = (pi + 1) % phrases.length; return setTimeout(type, 300); } // Reduced from 400ms
  setTimeout(type, del ? 50 : 100); // Slightly slower typing
}
type(); // Re-enabled after removing Font Awesome

/* ===== Hero Parallax ===== */
let parallaxTicking = false;
document.addEventListener('mousemove', e => {
  if (!parallaxTicking) {
    requestAnimationFrame(() => {
      const x = (e.clientX / window.innerWidth - .5) * 15;
      const y = (e.clientY / window.innerHeight - .5) * 8;
      const hw = document.querySelector('.hero-wrap');
      if (hw) hw.style.transform = `translate(${x * .3}px,${y * .3}px)`;
      parallaxTicking = false;
    });
    parallaxTicking = true;
  }
});

/* ===== 3D Tilt on Project Cards ===== */
document.querySelectorAll('.proj-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const cx = r.width / 2, cy = r.height / 2;
    const rx2 = (y - cy) / cy * -10, ry2 = (x - cx) / cx * 10;
    card.style.transform = `perspective(800px) rotateX(${rx2}deg) rotateY(${ry2}deg) scale(1.03)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)'; });
});

/* ===== Scroll Reveal ===== */
const ro = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      // Animate bars when skills visible
      if (e.target.closest('#skills')) animateBars();
      // Animate radial rings
      e.target.querySelectorAll('.fill').forEach(f => {
        const pct = parseInt(f.dataset.pct);
        const offset = 283 - (283 * pct / 100);
        f.style.strokeDashoffset = offset;
      });
      // Animate timeline
      e.target.querySelectorAll('.tl-item').forEach((item, i) => {
        setTimeout(() => item.classList.add('active'), i * 180);
      });
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el => ro.observe(el));

/* ===== Bar Chart Animate ===== */
function animateBars() {
  document.querySelectorAll('.bc-fill').forEach(f => {
    f.style.width = f.dataset.w;
  });
}

/* ===== Donut Chart (Canvas) ===== */
function drawDonut() {
  const c = document.getElementById('donut-canvas');
  if (!c) return;
  const dc = c.getContext('2d');
  c.width = 220; c.height = 220;
  const data = [
    { label: 'Python Development', val: 35, color: '#c084fc' },
    { label: 'Machine Learning', val: 30, color: '#7c3aed' },
    { label: 'Data Analytics', val: 20, color: '#f0abfc' },
    { label: 'Deep Learning', val: 15, color: '#38bdf8' }
  ];
  const total = data.reduce((s, d) => s + d.val, 0);
  let start = -Math.PI / 2;
  const cx = 110, cy = 110, r = 80, inner = 55;
  data.forEach(d => {
    const angle = (d.val / total) * Math.PI * 2;
    dc.beginPath();
    dc.moveTo(cx, cy);
    dc.arc(cx, cy, r, start, start + angle);
    dc.closePath();
    dc.fillStyle = d.color;
    dc.fill();
    start += angle;
  });
  // Donut hole
  dc.beginPath(); dc.arc(cx, cy, inner, 0, Math.PI * 2);
  dc.fillStyle = '#0a0d14'; dc.fill();
  // Center text
  dc.fillStyle = '#fff'; dc.font = 'bold 14px Outfit'; dc.textAlign = 'center'; dc.textBaseline = 'middle';
  dc.fillText('Focus', cx, cy - 8);
  dc.fillStyle = '#64748b'; dc.font = '11px Inter';
  dc.fillText('Areas', cx, cy + 10);
}
drawDonut();

/* ===== Hamburger Menu toggle ===== */
const menuToggle = document.getElementById('menu-toggle');
const navLinksGrp = document.getElementById('nav-links');
if (menuToggle && navLinksGrp) {
  menuToggle.addEventListener('click', () => {
    navLinksGrp.classList.toggle('active');
    const icon = menuToggle.querySelector('i');
    if (navLinksGrp.classList.contains('active')) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-times');
    } else {
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    }
  });

  navLinksGrp.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinksGrp.classList.remove('active');
      const icon = menuToggle.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });
  });
}

/* ===== Project Modal ===== */
const modalBg = document.getElementById('modal-bg');
const mTitle = document.getElementById('m-title');
const mDesc = document.getElementById('m-desc');
const mStack = document.getElementById('m-stack');
const mDemo = document.getElementById('m-demo');
const mRepo = document.getElementById('m-repo');

const projects = {
  'Driver Drowsiness Detection System': {
    desc: 'Crafted a real-time computer vision system to detect driver drowsiness using OpenCV and MobileNet. Constructed a deep learning pipeline featuring Haar Cascade face detection, eye-region extraction, and time-based alert logic. Integrated an automated alarm system that triggers when drowsiness persists for more than 5 seconds.',
    stack: ['Python', 'OpenCV', 'TensorFlow', 'Keras', 'MobileNet'],
    demo: '#', repo: 'https://github.com/Priya-611/AlertVision'
  },
  'Adidas Sales Dashboard': {
    desc: 'An interactive business intelligence dashboard that visualizes Adidas sales data across multiple regions, product categories, and time periods. Built with Excel for data cleaning and Power BI for visualization, the dashboard provides KPIs, trend analysis, and region-wise performance breakdowns. The insights help stakeholders make data-driven decisions on inventory, marketing spend, and expansion strategies.',
    stack: ['Excel', 'Power BI', 'Data Cleaning', 'DAX', 'Data Visualization', 'Business Intelligence'],
    demo: '#', repo: 'https://github.com/Priya-611/Adidas-Sales-Dashboard'
  },
  'Heart Disease Risk Predictor': {
    desc: 'Developed an ML web app for heart disease prediction with preprocessing, model training, and real-time backend integration. Implemented logistic regression with feature scaling and evaluation, achieving 84% test accuracy. Designed a responsive AI-assisted frontend integrated with the prediction API.',
    stack: ['Python', 'Flask', 'Scikit-learn', 'NumPy', 'Pandas', 'HTML', 'CSS'],
    demo: '#', repo: 'https://github.com/Priya-611/Heart-Disease-Risk-Predictor'
  }
};

document.querySelectorAll('[data-proj]').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    const key = btn.dataset.proj;
    const d = projects[key];
    mTitle.textContent = key;
    mDesc.textContent = d.desc;
    mStack.innerHTML = d.stack.map(s => `<span class="ptag">${s}</span>`).join('');
    mDemo.href = d.demo; mRepo.href = d.repo;
    mRepo.target = '_blank';
    modalBg.classList.add('show');
    document.body.style.overflow = 'hidden';
  });
});
function closeModal() { modalBg.classList.remove('show'); document.body.style.overflow = ''; }
document.getElementById('m-close').addEventListener('click', closeModal);
modalBg.addEventListener('click', e => { if (e.target === modalBg) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ===== Smooth Scroll ===== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ===== Contact Form ===== */
document.getElementById('c-form').addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type=submit]');
  btn.innerHTML = '<span style="margin-right:.5rem;">✅</span> Message Sent!';
  btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
  setTimeout(() => {
    btn.innerHTML = '<span style="margin-right:.5rem;">📤</span> Send Message';
    btn.style.background = '';
    e.target.reset();
  }, 3000);
});

/* ===== Animated Number Counters ===== */
function animateCounter(el) {
  const target = parseInt(el.dataset.to);
  const suffix = el.dataset.suffix || '';
  let cur = 0, step = target / 60;
  const iv = setInterval(() => {
    cur = Math.min(cur + step, target);
    el.textContent = Math.floor(cur) + suffix;
    if (cur >= target) clearInterval(iv);
  }, 25);
}
const cro = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      // Reset counters to 0 first
      e.target.querySelectorAll('[data-to]').forEach(el => {
        const suffix = el.dataset.suffix || '';
        el.textContent = '0' + suffix;
      });
      // Animate counters after a short delay
      setTimeout(() => {
        e.target.querySelectorAll('[data-to]').forEach(el => animateCounter(el));
      }, 300);
    }
  });
}, { threshold: .5 });
const statSection = document.querySelector('.hero-stats');
if (statSection) cro.observe(statSection);

/* ===== DSA Section Animations ===== */
const dsaObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      // Reset DSA counters to 0 first
      e.target.querySelectorAll('.dsa-big-num[data-to], .dsa-total-num[data-to]').forEach(el => {
        const suffix = el.dataset.suffix || '';
        el.textContent = '0' + suffix;
      });
      // Animate DSA counters
      setTimeout(() => {
        e.target.querySelectorAll('.dsa-big-num[data-to], .dsa-total-num[data-to]').forEach(el => animateCounter(el));
      }, 200);
      // Reset and animate DSA progress bars
      e.target.querySelectorAll('.dsa-bar-fill').forEach(f => {
        f.style.width = '0%';
        setTimeout(() => { f.style.width = f.dataset.w; }, 500);
      });
    }
  });
}, { threshold: 0.2 });
const dsaSection = document.getElementById('dsa');
if (dsaSection) dsaObs.observe(dsaSection);

/* ===== Direct AJAX Contact Form Handler ===== */
const contactForm = document.getElementById('c-form');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const btn = this.querySelector('button[type="submit"]');
    const originalBtnHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right:.4rem;"></i> Sending...';
    btn.style.pointerEvents = 'none';

    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const subject = document.getElementById('contact-subject').value;
    const message = document.getElementById('contact-message').value;

    fetch("https://formsubmit.co/ajax/priyarawat2334@gmail.com", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        email: email,
        _subject: subject,
        message: message,
        _captcha: "false"
      })
    })
      .then(response => response.json())
      .then(data => {
        // Check if it's the very first activation link response
        if (data.success === 'true' || data.success === true) {
          btn.innerHTML = '<i class="fas fa-thumbs-up fa-bounce" style="margin-right:.4rem;"></i> Message Sent Successfully!';
          btn.style.background = 'rgba(192, 132, 252, 0.2)';
          btn.style.border = '1px solid #c084fc';
          this.reset();
        } else {
          btn.innerHTML = '<i class="fas fa-exclamation-triangle" style="margin-right:.4rem;"></i> Verify your email!';
        }
      })
      .catch(error => {
        btn.innerHTML = '<i class="fas fa-exclamation-triangle" style="margin-right:.4rem;"></i> Needs Email Verification!';
      })
      .finally(() => {
        setTimeout(() => {
          btn.innerHTML = originalBtnHTML;
          btn.style.pointerEvents = 'auto';
          btn.style.background = '';
          btn.style.border = '';
        }, 3000);
      });
  });
}

