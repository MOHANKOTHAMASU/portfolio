/**
 * Mohan Venkata Subba Rao - Portfolio Web Application
 * Clean, modern, responsive vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Dark / Light Theme Toggle & Persistence
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Retrieve stored theme or default to dark
  const savedTheme = localStorage.getItem('portfolio_theme') || 'dark';
  htmlRoot.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('portfolio_theme', newTheme);

      if (window.update3DSceneTheme) {
        window.update3DSceneTheme(newTheme === 'dark');
      }

      showToast(`Switched to ${newTheme} mode`, 'info');
    });
  }

  // --------------------------------------------------------------------------
  // 2. Sticky Navbar & Active Navigation Scrollspy
  // --------------------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTopBtn = document.getElementById('back-to-top');

  function handleScroll() {
    const scrollY = window.pageYOffset;

    // Navbar shrink/shadow effect
    if (scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollY > 450) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Scrollspy to set active link
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial run

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --------------------------------------------------------------------------
  // 3. Mobile Navigation Menu Toggle
  // --------------------------------------------------------------------------
  const mobileToggleBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggleBtn && navMenu) {
    mobileToggleBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggleBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu on clicking any navigation link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggleBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        mobileToggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 4. Quick Copy to Clipboard Handler (Email / Phone)
  // --------------------------------------------------------------------------
  const copyButtons = document.querySelectorAll('.copy-btn');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        const originalHtml = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        btn.style.background = 'var(--accent-emerald)';
        btn.style.color = '#ffffff';

        showToast(`Copied to clipboard: ${textToCopy}`, 'success');

        setTimeout(() => {
          btn.innerHTML = originalHtml;
          btn.style.background = '';
          btn.style.color = '';
        }, 2200);
      } catch (err) {
        // Fallback for clipboard
        showToast(`Selected: ${textToCopy}`, 'info');
      }
    });
  });

  // --------------------------------------------------------------------------
  // 5. Resume Preview Modal Logic
  // --------------------------------------------------------------------------
  const previewModalBtn = document.getElementById('preview-resume-modal-btn');
  const resumeModal = document.getElementById('resume-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalCancelBtn = document.getElementById('modal-cancel-btn');

  function openResumeModal() {
    if (resumeModal) {
      resumeModal.classList.add('active');
      resumeModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeResumeModal() {
    if (resumeModal) {
      resumeModal.classList.remove('active');
      resumeModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  if (previewModalBtn) {
    previewModalBtn.addEventListener('click', openResumeModal);
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeResumeModal);
  }

  if (modalCancelBtn) {
    modalCancelBtn.addEventListener('click', closeResumeModal);
  }

  if (resumeModal) {
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) {
        closeResumeModal();
      }
    });
  }

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && resumeModal && resumeModal.classList.contains('active')) {
      closeResumeModal();
    }
  });

  // --------------------------------------------------------------------------
  // 6. Interactive Contact Form with Validation & Feedback
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');

  if (contactForm) {
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const messageInput = document.getElementById('contact-message');
    const subjectInput = document.getElementById('contact-subject');

    // Email regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
        nameInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else {
        nameInput.closest('.form-group').classList.remove('has-error');
      }

      // Validate Email
      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        emailInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else {
        emailInput.closest('.form-group').classList.remove('has-error');
      }

      // Validate Message
      if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
        messageInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else {
        messageInput.closest('.form-group').classList.remove('has-error');
      }

      if (!isValid) {
        showToast('Please correct the highlighted errors in the form.', 'info');
        return;
      }

      // Submit Button Loading State
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;

        const senderName = nameInput.value.trim();
        const senderEmail = emailInput.value.trim();
        const subject = subjectInput ? subjectInput.value.trim() || 'Software Developer Opportunity' : 'Software Developer Opportunity';
        const msgBody = messageInput.value.trim();

        // Show friendly success toast
        showToast(`Thank you, ${senderName}! Your message has been prepared.`, 'success');

        // Optional mailto trigger to open user's default client with prefilled content
        const mailtoUrl = `mailto:kmvsubbarao28@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Hi Mohan,\n\nName: ${senderName}\nEmail: ${senderEmail}\n\nMessage:\n${msgBody}`)}`;
        
        // Reset form fields
        contactForm.reset();

        // Provide easy option to send via mail client
        setTimeout(() => {
          if (confirm('Would you like to open your default email client to send this message directly to Mohan?')) {
            window.location.href = mailtoUrl;
          }
        }, 400);

      }, 900);
    });

    // Remove errors on input
    [nameInput, emailInput, messageInput].forEach(input => {
      if (input) {
        input.addEventListener('input', () => {
          input.closest('.form-group').classList.remove('has-error');
        });
      }
    });
  }

  // --------------------------------------------------------------------------
  // 7. Reusable Toast Notification System
  // --------------------------------------------------------------------------
  function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? '<i class="fa-solid fa-circle-check text-success"></i>' : '<i class="fa-solid fa-circle-info text-primary"></i>';
    toast.innerHTML = `${icon} <span>${message}</span>`;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'fadeOutToast 0.3s ease forwards';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 3500);
  }

  // --------------------------------------------------------------------------
  // 8. Interactive Three.js 3D Background Engine
  // --------------------------------------------------------------------------
  function init3DHeroBackground() {
    const canvas = document.getElementById('hero-3d-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const heroSection = document.getElementById('hero');
    if (!heroSection) return;

    // Create Scene, Camera, and Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      heroSection.clientWidth / heroSection.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 45;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(heroSection.clientWidth, heroSection.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particle Constellation Network
    const particleCount = 140;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    const xRange = 65;
    const yRange = 40;
    const zRange = 35;

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * xRange;
      positions[i + 1] = (Math.random() - 0.5) * yRange;
      positions[i + 2] = (Math.random() - 0.5) * zRange;

      velocities.push({
        x: (Math.random() - 0.5) * 0.04,
        y: (Math.random() - 0.5) * 0.04,
        z: (Math.random() - 0.5) * 0.03
      });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Theme color palette
    const isDarkTheme = htmlRoot.getAttribute('data-theme') !== 'light';
    let particleColor = isDarkTheme ? 0x60a5fa : 0x2563eb;
    let lineColor = isDarkTheme ? 0x3b82f6 : 0x93c5fd;

    // Particle Points Material
    const pointMaterial = new THREE.PointsMaterial({
      color: particleColor,
      size: 2.2,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    const particleSystem = new THREE.Points(geometry, pointMaterial);
    scene.add(particleSystem);

    // Dynamic Connecting Lines
    const lineMaterial = new THREE.LineBasicMaterial({
      color: lineColor,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending
    });
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(particleCount * particleCount * 3);
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lineMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lineMesh);

    // Floating 3D Geometric Tech Polyhedrons
    const polyhedrons = [];

    // 1. Wireframe Icosahedron (Center-Right)
    const icoGeo = new THREE.IcosahedronGeometry(7, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: isDarkTheme ? 0x38bdf8 : 0x0284c7,
      wireframe: true,
      transparent: true,
      opacity: 0.28
    });
    const icosahedron = new THREE.Mesh(icoGeo, icoMat);
    icosahedron.position.set(18, 5, -8);
    scene.add(icosahedron);
    polyhedrons.push({ mesh: icosahedron, rotX: 0.005, rotY: 0.007, rotZ: 0.003 });

    // 2. Wireframe Torus (Bottom-Left)
    const torusGeo = new THREE.TorusGeometry(6, 1.8, 12, 28);
    const torusMat = new THREE.MeshBasicMaterial({
      color: isDarkTheme ? 0xa78bfa : 0x7c3aed,
      wireframe: true,
      transparent: true,
      opacity: 0.22
    });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    torus.position.set(-22, -10, -12);
    scene.add(torus);
    polyhedrons.push({ mesh: torus, rotX: -0.006, rotY: 0.004, rotZ: 0.005 });

    // 3. Wireframe Octahedron (Top-Left)
    const octGeo = new THREE.OctahedronGeometry(4.5);
    const octMat = new THREE.MeshBasicMaterial({
      color: isDarkTheme ? 0x34d399 : 0x059669,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });
    const octahedron = new THREE.Mesh(octGeo, octMat);
    octahedron.position.set(-18, 12, -6);
    scene.add(octahedron);
    polyhedrons.push({ mesh: octahedron, rotX: 0.008, rotY: -0.006, rotZ: 0.004 });

    // 4. Glowing Center Ring (Depth)
    const ringGeo = new THREE.RingGeometry(12, 12.4, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: isDarkTheme ? 0x60a5fa : 0x3b82f6,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.15
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.set(12, -2, -15);
    scene.add(ring);
    polyhedrons.push({ mesh: ring, rotX: 0.003, rotY: 0.005, rotZ: -0.002 });

    // Interactive Mouse Tracking with Smooth Lerp
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    function onMouseMove(event) {
      const rect = heroSection.getBoundingClientRect();
      const clientX = event.clientX;
      const clientY = event.clientY;

      if (clientY >= rect.top && clientY <= rect.bottom) {
        targetX = ((clientX - rect.left) / rect.width - 0.5) * 14;
        targetY = -((clientY - rect.top) / rect.height - 0.5) * 14;
      }
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Theme Switch Callback
    window.update3DSceneTheme = (isDark) => {
      const pCol = isDark ? 0x60a5fa : 0x2563eb;
      const lCol = isDark ? 0x3b82f6 : 0x93c5fd;
      pointMaterial.color.setHex(pCol);
      lineMaterial.color.setHex(lCol);
      icoMat.color.setHex(isDark ? 0x38bdf8 : 0x0284c7);
      torusMat.color.setHex(isDark ? 0xa78bfa : 0x7c3aed);
      octMat.color.setHex(isDark ? 0x34d399 : 0x059669);
    };

    // Viewport Visibility Observer to Pause when off-screen
    let isHeroVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          isHeroVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(heroSection);

    // Animation Loop
    let animId;
    function animate() {
      animId = requestAnimationFrame(animate);

      if (!isHeroVisible) return;

      // Smooth camera interpolation
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;
      camera.position.x = mouseX;
      camera.position.y = mouseY;
      camera.lookAt(0, 0, 0);

      // Rotate geometric shapes
      polyhedrons.forEach(p => {
        p.mesh.rotation.x += p.rotX;
        p.mesh.rotation.y += p.rotY;
        p.mesh.rotation.z += p.rotZ;
      });

      // Update particle positions
      const pAttr = geometry.attributes.position;
      const posArr = pAttr.array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const v = velocities[i];

        posArr[i3] += v.x;
        posArr[i3 + 1] += v.y;
        posArr[i3 + 2] += v.z;

        // Bounce back inside boundaries
        if (Math.abs(posArr[i3]) > xRange / 2) v.x = -v.x;
        if (Math.abs(posArr[i3 + 1]) > yRange / 2) v.y = -v.y;
        if (Math.abs(posArr[i3 + 2]) > zRange / 2) v.z = -v.z;
      }
      pAttr.needsUpdate = true;

      // Connect nearby particles with dynamic lines
      let lineIndex = 0;
      const linePos = lineGeometry.attributes.position.array;
      const connectDist = 11.5;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        for (let j = i + 1; j < particleCount; j++) {
          const j3 = j * 3;
          const dx = posArr[i3] - posArr[j3];
          const dy = posArr[i3 + 1] - posArr[j3 + 1];
          const dz = posArr[i3 + 2] - posArr[j3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < connectDist) {
            linePos[lineIndex++] = posArr[i3];
            linePos[lineIndex++] = posArr[i3 + 1];
            linePos[lineIndex++] = posArr[i3 + 2];

            linePos[lineIndex++] = posArr[j3];
            linePos[lineIndex++] = posArr[j3 + 1];
            linePos[lineIndex++] = posArr[j3 + 2];
          }
        }
      }
      lineGeometry.setDrawRange(0, lineIndex / 3);
      lineGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    }
    animate();

    // Resize Handler
    function handleResize() {
      if (!heroSection) return;
      const width = heroSection.clientWidth;
      const height = heroSection.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    window.addEventListener('resize', handleResize);
  }

  // --------------------------------------------------------------------------
  // 9. True 3D Tilt & Dynamic Glare Physics Engine for Cards
  // --------------------------------------------------------------------------
  function init3DTiltCards() {
    const tiltCards = document.querySelectorAll(
      '.project-card, .skill-card, .cert-card, .stat-card, [data-tilt-3d]'
    );

    tiltCards.forEach(card => {
      // Inject dynamic glare overlay if not present
      if (!card.querySelector('.tilt-glare')) {
        const glare = document.createElement('div');
        glare.className = 'tilt-glare';
        card.appendChild(glare);
      }

      const maxTilt = 12; // Maximum tilt angle in degrees

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const xPercent = (x / rect.width) * 100;
        const yPercent = (y / rect.height) * 100;

        // Calculate rotation angles
        const rotateX = -((y / rect.height) - 0.5) * maxTilt * 2;
        const rotateY = ((x / rect.width) - 0.5) * maxTilt * 2;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025)`;
        card.style.setProperty('--glare-x', `${xPercent.toFixed(1)}%`);
        card.style.setProperty('--glare-y', `${yPercent.toFixed(1)}%`);
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        card.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      });

      card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.1s ease-out';
      });
    });
  }

  // Initialize 3D Engine and Tilt Systems
  init3DHeroBackground();
  init3DTiltCards();
});

