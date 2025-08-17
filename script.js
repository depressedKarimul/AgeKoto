const $ = (id) => document.getElementById(id);

    function daysInMonth(year, month /* 0-based */) {
      return new Date(year, month + 1, 0).getDate();
    }

    function formatDateHuman(d) {
      // Browser-এর লোকাল সেটিংস অনুসারে দেখাবে (আপনি চাইলে 'bn-BD' ব্যবহার করতে পারেন)
      try {
        return d.toLocaleDateString(undefined, {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
      } catch (_) {
        return d.toDateString();
      }
    }

    function calculateYMD(fromDate, toDate) {
      let y = toDate.getFullYear() - fromDate.getFullYear();
      let m = toDate.getMonth() - fromDate.getMonth();
      let d = toDate.getDate() - fromDate.getDate();

      if (d < 0) {
        // Borrow days from previous month
        m -= 1;
        const prevMonth = (toDate.getMonth() - 1 + 12) % 12;
        const prevMonthYear = prevMonth === 11 ? toDate.getFullYear() - 1 : toDate.getFullYear();
        d += daysInMonth(prevMonthYear, prevMonth);
      }
      if (m < 0) {
        m += 12;
        y -= 1;
      }
      return { years: y, months: m, days: d };
    }

    function clearOutput() {
      $("result").hidden = true;
      $("msg").innerHTML = "";
    }

    function showError(text) {
      $("msg").innerHTML = `<div class="error">${text}</div>`;
      $("result").hidden = true;
    }

    function onSubmit(e) {
      e.preventDefault();
      const dobStr = $("dob").value;
      if (!dobStr) { showError("অনুগ্রহ করে জন্মতারিখ দিন।"); return; }

      const dob = new Date(dobStr + 'T00:00:00'); // Local midnight
      const now = new Date();
      // Remove time part of 'now' for consistent diff
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      if (isNaN(dob.getTime())) { showError("ভুল তারিখ ফরম্যাট।"); return; }
      if (dob > today) { showError("ভবিষ্যতের তারিখ দেয়া যাবে না।"); return; }

      const { years, months, days } = calculateYMD(dob, today);
      const totalDays = Math.floor((today - dob) / (1000 * 60 * 60 * 24));

      // Update UI
      $("todayStr").textContent = formatDateHuman(today);
      $("years").textContent = years;
      $("months").textContent = months;
      $("days").textContent = days;
      $("totalDays").textContent = totalDays.toLocaleString();
      $("meta").textContent = `(~ ${(totalDays/365.2425).toFixed(2)} বছর)`;

      $("msg").innerHTML = "";
      $("result").hidden = false;
    }

    $("ageForm").addEventListener("submit", onSubmit);
    $("clearBtn").addEventListener("click", () => {
      $("dob").value = "";
      clearOutput();
      $("dob").focus();
    });