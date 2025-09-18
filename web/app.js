let transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
let currentLanguage = localStorage.getItem('language') || 'en';
let currentTheme = localStorage.getItem('theme') || 'light';
let chart = null;
let editId = null;

document.addEventListener('DOMContentLoaded', function() {
  initializeTheme();
  initializeLanguage();
  renderTransactions();
  updateSummary();
  initializeChart();
  attachEventListeners();
});

function initializeTheme() {
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon();
}

function updateThemeIcon() {
  const icon = document.querySelector('#themeToggle .material-symbols-outlined');
  icon.textContent = currentTheme === 'light' ? 'dark_mode' : 'light_mode';
}

function toggleTheme() {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  localStorage.setItem('theme', currentTheme);
  initializeTheme();
  updateChartTheme();
  showToast(currentLanguage === 'en' ? 'Theme updated!' : 'تم تحديث الثيم!', 'success');
}

function initializeLanguage() {
  document.documentElement.setAttribute('data-lang', currentLanguage);
  updateLanguageContent();
}

function updateLanguageContent() {
  document.querySelectorAll('[data-en][data-ar]').forEach(element => {
    const text = element.getAttribute(`data-${currentLanguage}`);
    if (text) {
      element.textContent = text;
    }
  });
  
  document.querySelectorAll('option[data-en][data-ar]').forEach(option => {
    const text = option.getAttribute(`data-${currentLanguage}`);
    if (text) {
      option.textContent = text;
    }
  });
}

function toggleLanguage() {
  currentLanguage = currentLanguage === 'en' ? 'ar' : 'en';
  localStorage.setItem('language', currentLanguage);
  initializeLanguage();
  updateChartLabels();
  showToast(currentLanguage === 'en' ? 'Language updated!' : 'تم تحديث اللغة!', 'success');
}

function addTransaction(description, amount, category, type) {
  const transaction = {
    id: Date.now().toString(),
    description,
    amount: parseFloat(amount),
    category,
    type,
    date: new Date().toISOString()
  };
  
  transactions.unshift(transaction);
  localStorage.setItem('transactions', JSON.stringify(transactions));
  
  renderTransactions();
  updateSummary();
  updateChart();
  
  showToast(currentLanguage === 'en' ? 'Transaction added successfully!' : 'تمت إضافة المعاملة بنجاح!', 'success');
}

function editTransaction(id) {
  const transaction = transactions.find(t => t.id === id);
  if (transaction) {
    document.getElementById('description').value = transaction.description;
    document.getElementById('amount').value = transaction.amount;
    document.getElementById('category').value = transaction.category;
    document.getElementById('type').value = transaction.type;
    
    editId = id;
    const form = document.getElementById('transactionForm');
    const submitBtn = form.querySelector('button[type="submit"] span:last-child');
    submitBtn.textContent = currentLanguage === 'en' ? 'Update Transaction' : 'تحديث المعاملة';
    
    document.getElementById('description').focus();
    showToast(currentLanguage === 'en' ? 'Transaction loaded for editing' : 'تم تحميل المعاملة للتعديل', 'success');
  }
}

function updateTransaction(id, description, amount, category, type) {
  const index = transactions.findIndex(t => t.id === id);
  if (index !== -1) {
    transactions[index] = {
      ...transactions[index],
      description,
      amount: parseFloat(amount),
      category,
      type
    };
    
    localStorage.setItem('transactions', JSON.stringify(transactions));
    renderTransactions();
    updateSummary();
    updateChart();
    
    showToast(currentLanguage === 'en' ? 'Transaction updated successfully!' : 'تم تحديث المعاملة بنجاح!', 'success');
  }
}

function removeTransaction(id) {
  if (confirm(currentLanguage === 'en' ? 'Are you sure you want to delete this transaction?' : 'هل أنت متأكد من حذف هذه المعاملة؟')) {
    transactions = transactions.filter(t => t.id !== id);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    renderTransactions();
    updateSummary();
    updateChart();
    
    showToast(currentLanguage === 'en' ? 'Transaction deleted successfully!' : 'تم حذف المعاملة بنجاح!', 'success');
  }
}

function resetForm() {
  document.getElementById('transactionForm').reset();
  editId = null;
  const submitBtn = document.querySelector('#transactionForm button[type="submit"] span:last-child');
  submitBtn.textContent = currentLanguage === 'en' ? 'Add Transaction' : 'إضافة معاملة';
}

function renderTransactions() {
  const container = document.getElementById('transactionList');
  
  if (transactions.length === 0) {
    container.innerHTML = '';
    const emptyDiv = document.createElement('div');
    emptyDiv.className = 'empty-state';
    
    const iconDiv = document.createElement('div');
    iconDiv.className = 'empty-icon material-symbols-outlined';
    iconDiv.textContent = 'receipt_long';
    
    const title = document.createElement('h4');
    title.textContent = currentLanguage === 'en' ? 'No transactions yet' : 'لا توجد معاملات بعد';
    
    const subtitle = document.createElement('p');
    subtitle.textContent = currentLanguage === 'en' ? 'Add your first transaction to get started!' : 'أضف أول معاملة للبدء!';
    
    emptyDiv.appendChild(iconDiv);
    emptyDiv.appendChild(title);
    emptyDiv.appendChild(subtitle);
    container.appendChild(emptyDiv);
    return;
  }

  const categoryIcons = {
    food: 'restaurant',
    transport: 'directions_car',
    shopping: 'shopping_cart',
    entertainment: 'movie',
    healthcare: 'local_hospital',
    utilities: 'electrical_services',
    salary: 'payments',
    other: 'category'
  };

  container.innerHTML = '';
  transactions.forEach(transaction => {
    const transactionDiv = document.createElement('div');
    transactionDiv.className = 'transaction-item';
    
    const infoDiv = document.createElement('div');
    infoDiv.className = 'transaction-info';
    
    const title = document.createElement('h4');
    title.textContent = transaction.description;
    
    const meta = document.createElement('p');
    const date = new Date(transaction.date).toLocaleDateString();
    const categoryText = document.querySelector(`option[value="${transaction.category}"]`).getAttribute(`data-${currentLanguage}`) || transaction.category;
    meta.textContent = `${categoryText} • ${date}`;
    
    infoDiv.appendChild(title);
    infoDiv.appendChild(meta);
    
    const amountDiv = document.createElement('div');
    amountDiv.className = 'transaction-amount';
    
    const iconSpan = document.createElement('span');
    iconSpan.className = 'material-symbols-outlined';
    iconSpan.textContent = categoryIcons[transaction.category] || 'category';
    iconSpan.style.color = 'var(--primary)';
    
    const amountSpan = document.createElement('span');
    amountSpan.className = `amount-value amount-${transaction.type}`;
    amountSpan.textContent = `${transaction.type === 'income' ? '+' : '-'}$${transaction.amount.toFixed(2)}`;
    
    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'transaction-actions';
    
    const editBtn = document.createElement('button');
    editBtn.className = 'icon-button';
    editBtn.style.width = '32px';
    editBtn.style.height = '32px';
    editBtn.style.background = 'var(--secondary)';
    editBtn.title = currentLanguage === 'en' ? 'Edit Transaction' : 'تعديل المعاملة';
    editBtn.onclick = () => editTransaction(transaction.id);
    const editIcon = document.createElement('span');
    editIcon.className = 'material-symbols-outlined';
    editIcon.style.fontSize = '18px';
    editIcon.textContent = 'edit';
    editBtn.appendChild(editIcon);
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'icon-button';
    deleteBtn.style.width = '32px';
    deleteBtn.style.height = '32px';
    deleteBtn.style.background = 'var(--error)';
    deleteBtn.title = currentLanguage === 'en' ? 'Delete Transaction' : 'حذف المعاملة';
    deleteBtn.onclick = () => removeTransaction(transaction.id);
    const deleteIcon = document.createElement('span');
    deleteIcon.className = 'material-symbols-outlined';
    deleteIcon.style.fontSize = '18px';
    deleteIcon.textContent = 'delete';
    deleteBtn.appendChild(deleteIcon);
    
    buttonsDiv.appendChild(editBtn);
    buttonsDiv.appendChild(deleteBtn);
    
    amountDiv.appendChild(iconSpan);
    amountDiv.appendChild(amountSpan);
    amountDiv.appendChild(buttonsDiv);
    
    transactionDiv.appendChild(infoDiv);
    transactionDiv.appendChild(amountDiv);
    container.appendChild(transactionDiv);
  });
}

function updateSummary() {
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  document.getElementById('currentBalance').textContent = '$' + balance.toFixed(2);
  document.getElementById('totalIncome').textContent = '$' + totalIncome.toFixed(2);
  document.getElementById('totalExpenses').textContent = '$' + totalExpenses.toFixed(2);
  document.getElementById('transactionCount').textContent = transactions.length.toString();
}

function initializeChart() {
  const ctx = document.getElementById('expenseChart').getContext('2d');
  chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: [
          '#ff9800', '#2196f3', '#e91e63', '#9c27b0',
          '#607d8b', '#4caf50', '#8bc34a', '#795548'
        ],
        borderWidth: 0,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            usePointStyle: true,
            color: getComputedStyle(document.documentElement).getPropertyValue('--on-surface').trim()
          }
        }
      },
      cutout: '60%'
    }
  });

  updateChart();
}

function updateChart() {
  if (!chart) return;

  const expensesByCategory = {};
  transactions.filter(t => t.type === 'expense').forEach(transaction => {
    expensesByCategory[transaction.category] = (expensesByCategory[transaction.category] || 0) + transaction.amount;
  });

  const labels = Object.keys(expensesByCategory);
  const data = Object.values(expensesByCategory);

  chart.data.labels = labels;
  chart.data.datasets[0].data = data;
  chart.update();
}

function updateChartTheme() {
  if (!chart) return;
  chart.options.plugins.legend.labels.color = getComputedStyle(document.documentElement).getPropertyValue('--on-surface').trim();
  chart.update();
}

function updateChartLabels() {
  if (!chart) return;
  
  const expensesByCategory = {};
  transactions.filter(t => t.type === 'expense').forEach(transaction => {
    const categoryText = document.querySelector(`option[value="${transaction.category}"]`)?.getAttribute(`data-${currentLanguage}`) || transaction.category;
    expensesByCategory[categoryText] = (expensesByCategory[categoryText] || 0) + transaction.amount;
  });

  chart.data.labels = Object.keys(expensesByCategory);
  chart.data.datasets[0].data = Object.values(expensesByCategory);
  chart.update();
}

function sanitizeForCsv(value) {
  let v = String(value).replace(/"/g, '""');
  if (/^[=+\-@]/.test(v)) v = "'" + v;
  return `"${v}"`;
}

function exportToCsv() {
  if (transactions.length === 0) {
    showToast(currentLanguage === 'en' ? 'No transactions to export!' : 'لا توجد معاملات للتصدير!', 'error');
    return;
  }

  const headers = ['Date', 'Description', 'Amount', 'Category', 'Type'];
  const csvContent = [
    headers.join(','),
    ...transactions.map(t => [
      sanitizeForCsv(new Date(t.date).toLocaleDateString()),
      sanitizeForCsv(t.description),
      sanitizeForCsv(t.amount),
      sanitizeForCsv(t.category),
      sanitizeForCsv(t.type)
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `expenses-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);

  showToast(currentLanguage === 'en' ? 'CSV exported successfully!' : 'تم تصدير CSV بنجاح!', 'success');
}

function parseCsvLine(line) {
  const fields = [];
  let field = '';
  let inQuotes = false;
  let i = 0;
  
  while (i < line.length) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (!inQuotes && char === '"') {
      inQuotes = true;
    } else if (inQuotes && char === '"' && nextChar === '"') {
      field += '"';
      i++;
    } else if (inQuotes && char === '"') {
      inQuotes = false;
    } else if (!inQuotes && char === ',') {
      fields.push(field);
      field = '';
    } else {
      field += char;
    }
    i++;
  }
  
  fields.push(field);
  return fields;
}

function importFromCsv(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const csv = e.target.result.trim();
      const lines = csv.split(/\r?\n/);
      const headers = parseCsvLine(lines[0]);
      
      let importCount = 0;
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue;
        
        const values = parseCsvLine(lines[i]);
        if (values.length >= 5) {
          let description = values[1].trim();
          const amount = parseFloat(values[2].replace(/"/g, ''));
          let category = values[3].trim();
          let type = values[4].trim();
          
          description = description.replace(/^"|"$/g, '').replace(/^'/, '');
          category = category.replace(/^"|"$/g, '');
          type = type.replace(/^"|"$/g, '');
          
          if (description && !isNaN(amount) && category && type) {
            const transaction = {
              id: Date.now().toString() + i,
              description,
              amount,
              category,
              type,
              date: new Date().toISOString()
            };
            transactions.unshift(transaction);
            importCount++;
          }
        }
      }
      
      if (importCount > 0) {
        localStorage.setItem('transactions', JSON.stringify(transactions));
        renderTransactions();
        updateSummary();
        updateChart();
        showToast(
          currentLanguage === 'en' 
            ? `${importCount} transactions imported successfully!` 
            : `تم استيراد ${importCount} معاملة بنجاح!`, 
          'success'
        );
      } else {
        showToast(currentLanguage === 'en' ? 'No valid transactions found in CSV!' : 'لم يتم العثور على معاملات صحيحة في CSV!', 'error');
      }
    } catch (error) {
      showToast(currentLanguage === 'en' ? 'Error importing CSV file!' : 'خطأ في استيراد ملف CSV!', 'error');
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}

function showToast(message, type) {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 100);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => document.body.removeChild(toast), 300);
  }, 3000);
}

function attachEventListeners() {
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);
  document.getElementById('languageToggle').addEventListener('click', toggleLanguage);
  
  document.getElementById('transactionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const description = document.getElementById('description').value.trim();
    const amount = document.getElementById('amount').value;
    const category = document.getElementById('category').value;
    const type = document.getElementById('type').value;
    
    if (description && amount && category && type) {
      if (editId) {
        updateTransaction(editId, description, amount, category, type);
        resetForm();
      } else {
        addTransaction(description, amount, category, type);
        this.reset();
      }
    } else {
      showToast(currentLanguage === 'en' ? 'Please fill all fields correctly' : 'يرجى ملء جميع الحقول بشكل صحيح', 'error');
    }
  });
  
  document.addEventListener('click', function(e) {
    if (!e.target.closest('#transactionForm') && !e.target.closest('.transaction-item')) {
      if (editId) {
        resetForm();
      }
    }
  });
  
  document.getElementById('exportCsv').addEventListener('click', exportToCsv);
  document.getElementById('importCsv').addEventListener('change', importFromCsv);
  
  document.getElementById('quickAddFab').addEventListener('click', function() {
    resetForm();
    document.getElementById('description').focus();
  });
  
  document.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey) {
      switch(e.key) {
        case 'n':
          e.preventDefault();
          resetForm();
          document.getElementById('description').focus();
          break;
        case 'e':
          e.preventDefault();
          exportToCsv();
          break;
        case 'd':
          e.preventDefault();
          toggleTheme();
          break;
      }
    }
    
    if (e.key === 'Escape') {
      resetForm();
    }
  });
}