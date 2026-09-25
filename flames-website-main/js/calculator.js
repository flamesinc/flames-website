/**
 * FLAMES Commercial Cooking Stove - Fuel Savings Calculator
 * Handles fuel calculations for LPG, Coal, and Firewood vs FLAMES Biomass Wood Pellets.
 */

const FUEL_CONFIGS = {
  lpg: {
    name: 'Commercial LPG (19kg)',
    unit: 'cylinders/month',
    sliderMin: 4,
    sliderMax: 100,
    sliderStep: 1,
    defaultAmount: 20,
    defaultPrice: 1950,
    priceUnit: '₹ per 19kg cylinder',
    // Benchmark: 20 cylinders @ ₹1950 = ₹39,000/mo.
    // Prompt benchmark: ₹40,000 drops to ₹30,000 (25% saving).
    savingsRate: 0.25,
    unitLabel: 'Cylinders'
  },
  coal: {
    name: 'Commercial Coal / Charcoal',
    unit: 'kg/month',
    sliderMin: 200,
    sliderMax: 4000,
    sliderStep: 50,
    defaultAmount: 1400,
    defaultPrice: 28,
    priceUnit: '₹ per kg',
    savingsRate: 0.28,
    unitLabel: 'kg'
  },
  wood: {
    name: 'Commercial Firewood',
    unit: 'kg/month',
    sliderMin: 500,
    sliderMax: 6000,
    sliderStep: 100,
    defaultAmount: 3500,
    defaultPrice: 11,
    priceUnit: '₹ per kg',
    savingsRate: 0.30,
    unitLabel: 'kg'
  }
};

class FuelSavingsCalculator {
  constructor() {
    this.currentFuel = 'lpg';
    this.amount = FUEL_CONFIGS.lpg.defaultAmount;
    this.price = FUEL_CONFIGS.lpg.defaultPrice;
    this.cookingHours = 10;
    this.phoneNumber = '';
    this.salesWhatsApp = '917021851466';

    this.initElements();
    this.bindEvents();
    this.updateUI();
  }

  initElements() {
    // Fuel selector tabs
    this.fuelTabs = document.querySelectorAll('[data-fuel-tab]');
    
    // Inputs & Sliders
    this.amountSlider = document.getElementById('calc-amount-slider');
    this.amountInput = document.getElementById('calc-amount-input');
    this.amountUnitBadge = document.getElementById('calc-amount-unit');
    this.amountLabel = document.getElementById('calc-amount-label');

    this.priceInput = document.getElementById('calc-price-input');
    this.priceUnitLabel = document.getElementById('calc-price-unit');

    this.hoursSlider = document.getElementById('calc-hours-slider');
    this.hoursInput = document.getElementById('calc-hours-input');

    // Outputs
    this.currentCostEl = document.getElementById('calc-out-current');
    this.flamesCostEl = document.getElementById('calc-out-flames');
    this.monthlySavingsEl = document.getElementById('calc-out-monthly-savings');
    this.annualSavingsEl = document.getElementById('calc-out-annual-savings');
    this.savingsPercentEl = document.getElementById('calc-out-percent');
    this.cookingSpeedEl = document.getElementById('calc-out-speed');
    this.currentCostBar = document.getElementById('calc-bar-current');
    this.flamesCostBar = document.getElementById('calc-bar-flames');

    // Lead Capture
    this.phoneInput = document.getElementById('calc-lead-phone');
    this.whatsappBtn = document.getElementById('calc-lead-submit');
  }

  bindEvents() {
    // Fuel tab switching
    this.fuelTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        const fuel = tab.getAttribute('data-fuel-tab');
        this.setFuel(fuel);
      });
    });

    // Amount slider & input sync
    if (this.amountSlider && this.amountInput) {
      this.amountSlider.addEventListener('input', (e) => {
        this.amount = parseFloat(e.target.value) || 0;
        this.amountInput.value = this.amount;
        this.updateUI();
      });

      this.amountInput.addEventListener('input', (e) => {
        this.amount = parseFloat(e.target.value) || 0;
        this.amountSlider.value = this.amount;
        this.updateUI();
      });
    }

    // Price input
    if (this.priceInput) {
      this.priceInput.addEventListener('input', (e) => {
        this.price = parseFloat(e.target.value) || 0;
        this.updateUI();
      });
    }

    // Hours slider & input sync
    if (this.hoursSlider && this.hoursInput) {
      this.hoursSlider.addEventListener('input', (e) => {
        this.cookingHours = parseFloat(e.target.value) || 4;
        this.hoursInput.value = this.cookingHours;
        this.updateUI();
      });

      this.hoursInput.addEventListener('input', (e) => {
        this.cookingHours = parseFloat(e.target.value) || 4;
        this.hoursSlider.value = this.cookingHours;
        this.updateUI();
      });
    }

    // WhatsApp Assessment Button
    if (this.whatsappBtn) {
      this.whatsappBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleWhatsAppSubmit();
      });
    }
  }

  setFuel(fuel) {
    if (!FUEL_CONFIGS[fuel]) return;
    this.currentFuel = fuel;
    const config = FUEL_CONFIGS[fuel];

    // Update active tab styles
    this.fuelTabs.forEach(tab => {
      const isSelected = tab.getAttribute('data-fuel-tab') === fuel;
      tab.classList.toggle('active-fuel-tab', isSelected);
      tab.classList.toggle('inactive-fuel-tab', !isSelected);
    });

    // Update slider bounds & defaults
    if (this.amountSlider && this.amountInput) {
      this.amountSlider.min = config.sliderMin;
      this.amountSlider.max = config.sliderMax;
      this.amountSlider.step = config.sliderStep;
      this.amount = config.defaultAmount;
      this.amountSlider.value = this.amount;
      this.amountInput.value = this.amount;
    }

    if (this.amountLabel) {
      this.amountLabel.textContent = `Monthly ${config.name} Consumption`;
    }
    if (this.amountUnitBadge) {
      this.amountUnitBadge.textContent = config.unit;
    }

    if (this.priceInput) {
      this.price = config.defaultPrice;
      this.priceInput.value = this.price;
    }
    if (this.priceUnitLabel) {
      this.priceUnitLabel.textContent = config.priceUnit;
    }

    this.updateUI();
  }

  calculate() {
    const config = FUEL_CONFIGS[this.currentFuel];
    const currentMonthlyCost = Math.round(this.amount * this.price);

    // Efficiency multiplier based on cooking hours
    const hoursBonus = this.cookingHours > 10 ? 0.03 : 0.0;
    const effectiveSavingsRate = Math.min(0.40, config.savingsRate + hoursBonus);

    // FLAMES cost
    const flamesMonthlyCost = Math.round(currentMonthlyCost * (1 - effectiveSavingsRate));
    const monthlySavings = currentMonthlyCost - flamesMonthlyCost;
    const annualSavings = monthlySavings * 12;
    const savingsPercent = Math.round((monthlySavings / (currentMonthlyCost || 1)) * 100);

    return {
      currentMonthlyCost,
      flamesMonthlyCost,
      monthlySavings,
      annualSavings,
      savingsPercent,
      cookingHours: this.cookingHours
    };
  }

  formatINR(num) {
    return '₹' + Number(num).toLocaleString('en-IN');
  }

  updateUI() {
    const results = this.calculate();

    if (this.currentCostEl) this.currentCostEl.textContent = this.formatINR(results.currentMonthlyCost);
    if (this.flamesCostEl) this.flamesCostEl.textContent = this.formatINR(results.flamesMonthlyCost);
    if (this.monthlySavingsEl) this.monthlySavingsEl.textContent = this.formatINR(results.monthlySavings);
    if (this.annualSavingsEl) this.annualSavingsEl.textContent = this.formatINR(results.annualSavings);
    if (this.savingsPercentEl) this.savingsPercentEl.textContent = `${results.savingsPercent}%`;

    // Visual progress bars
    if (this.currentCostBar && this.flamesCostBar) {
      this.currentCostBar.style.width = '100%';
      const flamesRatio = Math.max(20, Math.round((results.flamesMonthlyCost / (results.currentMonthlyCost || 1)) * 100));
      this.flamesCostBar.style.width = `${flamesRatio}%`;
    }
  }

  handleWhatsAppSubmit() {
    const phone = this.phoneInput ? this.phoneInput.value.trim() : '';
    
    // Quick validation if phone is provided
    if (phone && !/^[6-9]\d{9}$/.test(phone.replace(/\D/g, ''))) {
      alert('Please enter a valid 10-digit Indian WhatsApp mobile number.');
      if (this.phoneInput) this.phoneInput.focus();
      return;
    }

    const results = this.calculate();
    const config = FUEL_CONFIGS[this.currentFuel];

    const message = 
`*FLAMES Commercial Kitchen Savings Inquiry*
----------------------------------------
🔥 *Current Fuel:* ${config.name}
📦 *Consumption:* ${this.amount} ${config.unit} @ ${this.formatINR(this.price)}
⏱️ *Daily Usage:* ${this.cookingHours} hours/day
----------------------------------------
📊 *Current Monthly Bill:* ${this.formatINR(results.currentMonthlyCost)}
🔥 *Estimated FLAMES Cost:* ${this.formatINR(results.flamesMonthlyCost)}
💰 *Estimated Monthly Savings:* ${this.formatINR(results.monthlySavings)} (${results.savingsPercent}%)
📈 *Estimated Annual Savings:* ${this.formatINR(results.annualSavings)}
${phone ? `📞 *My WhatsApp Phone:* +91 ${phone}` : ''}
----------------------------------------
Please provide a free on-site fuel-cost assessment and equipment proposal.`;

    const encodedMsg = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${this.salesWhatsApp}?text=${encodedMsg}`;
    window.open(whatsappUrl, '_blank');
  }
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
  window.flamesCalculator = new FuelSavingsCalculator();
});
