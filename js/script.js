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
  // 5b. Robust Automatic One-Click PDF Resume Downloader
  // Forces direct save to Downloads folder across desktop & mobile browsers
  // --------------------------------------------------------------------------
  function downloadResumeFromBase64(filename = 'Mohan_Venkata_Subba_Rao_Resume.pdf') {
    if (window.RESUME_PDF_BASE64) {
      try {
        const byteCharacters = atob(window.RESUME_PDF_BASE64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          window.URL.revokeObjectURL(blobUrl);
          if (a.parentNode) a.parentNode.removeChild(a);
        }, 2000);
        showToast('Resume downloaded directly to your device!', 'success');
        return true;
      } catch (e) {
        console.warn('Base64 blob conversion error:', e);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = 'data:application/pdf;base64,' + window.RESUME_PDF_BASE64;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          if (a.parentNode) a.parentNode.removeChild(a);
        }, 2000);
        showToast('Resume downloaded directly to your device!', 'success');
        return true;
      }
    }
    return false;
  }

  async function triggerDirectDownload(url, filename) {
    showToast('Starting resume download...', 'info');

    // 1. Instant direct download via preloaded Base64 (works on file://, localhost, and live web)
    if (downloadResumeFromBase64(filename)) {
      return;
    }

    // 2. Fetch Blob fallback
    try {
      const response = await fetch(url, { cache: 'no-cache' });
      if (!response.ok) {
        throw new Error(`File request failed with status: ${response.status}`);
      }
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const tempLink = document.createElement('a');
      tempLink.style.display = 'none';
      tempLink.href = blobUrl;
      tempLink.download = filename;
      document.body.appendChild(tempLink);
      tempLink.click();

      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
        if (tempLink.parentNode) {
          tempLink.parentNode.removeChild(tempLink);
        }
      }, 2000);

      showToast('Resume downloaded successfully to your device!', 'success');
    } catch (err) {
      console.warn('Direct Blob download failed, attempting native download:', err);
      try {
        const fallbackLink = document.createElement('a');
        fallbackLink.href = url;
        fallbackLink.download = filename;
        document.body.appendChild(fallbackLink);
        fallbackLink.click();
        document.body.removeChild(fallbackLink);
        showToast('Download started via browser fallback.', 'info');
      } catch (fallbackErr) {
        console.error('All download methods failed:', fallbackErr);
        showToast('Error: Resume file could not be downloaded. Please try again or use View Resume.', 'info');
      }
    }
  }

  // Intercept all resume download links to guarantee direct automatic download
  const resumeDownloadLinks = document.querySelectorAll('a[download]');
  resumeDownloadLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const url = link.getAttribute('href');
      const filename = link.getAttribute('download') || 'Mohan_Venkata_Subba_Rao_Resume.pdf';
      if (url && url.toLowerCase().includes('.pdf')) {
        e.preventDefault();
        triggerDirectDownload(url, filename);
      }
    });
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

        const formattedEmailBody = `Hi Mohan,\n\nName: ${senderName}\nEmail: ${senderEmail}\n\nMessage:\n${msgBody}`;

        // Gmail Web Compose direct URL
        const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=kmvsubbarao28@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(formattedEmailBody)}`;
        
        // Native Mailto fallback URL
        const mailtoUrl = `mailto:kmvsubbarao28@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(formattedEmailBody)}`;

        // Show friendly success toast
        showToast(`Opening Gmail Compose for ${senderName}...`, 'success');

        // Open Gmail in new tab, or fallback to mailto
        const newWin = window.open(gmailComposeUrl, '_blank');
        if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
          // Popup blocked or mobile device: fallback to mailto link
          window.location.href = mailtoUrl;
        }

        // Reset form fields
        contactForm.reset();
      }, 700);
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
});




