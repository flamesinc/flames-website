/**
 * FLAMES Commercial Cooking Stove - Main Interactions
 * Navigation, FAQ Accordions, Quote Modals, Mobile Menu, and Tracking.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden', !isHidden);
      mobileMenuBtn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 2. Smooth Scroll for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // 3. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon');

    if (trigger && content) {
      trigger.addEventListener('click', () => {
        const isOpen = !content.classList.contains('hidden');

        // Close all other FAQs (optional single open behavior)
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            const otherContent = otherItem.querySelector('.faq-content');
            const otherIcon = otherItem.querySelector('.faq-icon');
            if (otherContent) otherContent.classList.add('hidden');
            if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
          }
        });

        // Toggle current
        content.classList.toggle('hidden', isOpen);
        if (icon) {
          icon.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
        }
      });
    }
  });

  // 4. Quote Request Modal
  const quoteModal = document.getElementById('quote-modal');
  const quoteModalClose = document.getElementById('quote-modal-close');
  const quoteForm = document.getElementById('quote-form');
  const quoteModelInput = document.getElementById('quote-model-name');
  const openQuoteBtns = document.querySelectorAll('[data-open-quote]');

  function openModal(modelName = 'Commercial Stove') {
    if (quoteModal) {
      if (quoteModelInput) quoteModelInput.value = modelName;
      const modalTitle = document.getElementById('quote-modal-title');
      if (modalTitle) modalTitle.textContent = `Get Quote: ${modelName}`;
      quoteModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (quoteModal) {
      quoteModal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  openQuoteBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const model = btn.getAttribute('data-open-quote') || 'FLAMES Commercial Stove';
      openModal(model);
    });
  });

  if (quoteModalClose) {
    quoteModalClose.addEventListener('click', closeModal);
  }

  if (quoteModal) {
    quoteModal.addEventListener('click', (e) => {
      if (e.target === quoteModal) closeModal();
    });
  }

  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('quote-name')?.value.trim() || '';
      const business = document.getElementById('quote-business')?.value.trim() || '';
      const city = document.getElementById('quote-city')?.value.trim() || '';
      const phone = document.getElementById('quote-phone')?.value.trim() || '';
      const model = quoteModelInput?.value || 'Commercial Stove';
      const notes = document.getElementById('quote-notes')?.value.trim() || '';

      const msg = 
`*FLAMES Equipment Quote Request*
--------------------------------
🛠️ *Model:* ${model}
👤 *Name:* ${name}
🏢 *Business / Kitchen:* ${business}
📍 *Location / City:* ${city}
📞 *Phone:* ${phone}
${notes ? `📝 *Requirements:* ${notes}` : ''}
--------------------------------
Please share technical specifications, commercial pricing, and pellet supply details.`;

      const whatsappUrl = `https://wa.me/917021651435?text=${encodeURIComponent(msg)}`;
      window.open(whatsappUrl, '_blank');
      closeModal();
    });
  }

  // 5. Header backdrop blur on scroll
  const mainHeader = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      mainHeader?.classList.add('bg-[#141414]/95', 'backdrop-blur-md', 'shadow-lg', 'border-b', 'border-[#262626]');
      mainHeader?.classList.remove('bg-transparent');
    } else {
      mainHeader?.classList.remove('bg-[#141414]/95', 'backdrop-blur-md', 'shadow-lg', 'border-b', 'border-[#262626]');
      mainHeader?.classList.add('bg-transparent');
    }
  });
});
