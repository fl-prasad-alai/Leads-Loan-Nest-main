document.getElementById('leadForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData();

  const lead = {
    first_name: form.first_name.value,
    last_name: form.last_name.value,
    phone: form.phone.value,
    email: form.email.value,
    dob: form.dob.value,
    pan_card: form.pan_card.value,
    type: form.type.value,
  };

  const business = {
    business_name: form.business_name.value,
    business_type: form.business_type.value,
    gst_number: form.gst_number.value,
    turnover: parseFloat(form.turnover.value),
  };

  const loan = {
    amount: parseFloat(form.amount.value),
    tenure: parseInt(form.tenure.value),
    interest_rate: parseFloat(form.interest_rate.value),
  };

  const data = { lead, business, loan };

  formData.append('data', JSON.stringify(data));
  formData.append('panDoc', form.panDoc.files[0]);
  formData.append('aadhaarDoc', form.aadhaarDoc.files[0]);
  formData.append('gstDoc', form.gstDoc.files[0]);

  try {
    const response = await fetch('http://localhost:3000/workflow/execute/loan-application', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (response.ok) {
      document.getElementById('status').innerText = '✅ Lead submitted successfully!';
    } else {
      document.getElementById('status').innerText = `❌ Error: ${result.message || 'Unknown error'}`;
    }
  } catch (err) {
    document.getElementById('status').innerText = `❌ Error submitting lead: ${err.message}`;
  }
});
