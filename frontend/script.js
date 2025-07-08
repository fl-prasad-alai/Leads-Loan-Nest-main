const form = document.getElementById("leadForm");
const alertBox = document.getElementById("alert");
const leadsList = document.getElementById("leadsList");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData();

  const lead = {
    first_name: form.first_name.value,
    last_name: form.last_name.value,
    phone: form.phone.value,
    email: form.email.value,
    dob: form.dob.value,
    pan_card: form.pan_card.value,
    type: form.type.value
  };

  const business = {
    business_name: form.business_name.value,
    business_type: form.business_type.value,
    gst_number: form.gst_number.value,
    turnover: Number(form.turnover.value)
  };

  const loan = {
    amount: Number(form.amount.value),
    tenure: Number(form.tenure.value),
    interest_rate: Number(form.interest_rate.value)
  };

  formData.append("data", JSON.stringify({ lead, business, loan }));
  formData.append("panDoc", form.panDoc.files[0]);
  formData.append("aadhaarDoc", form.aadhaarDoc.files[0]);
  formData.append("gstDoc", form.gstDoc.files[0]);

  try {
    const res = await fetch("http://localhost:3000/workflow/execute/loan-application", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Submission failed");

    alertBox.innerText = "✅ Lead submitted!";
    alertBox.style.color = "green";
    form.reset();
    loadLeads();
  } catch (err) {
    alertBox.innerText = "❌ Error submitting lead!";
    alertBox.style.color = "red";
    console.error(err);
  }
});

async function loadLeads() {
  leadsList.innerHTML = "";

  try {
    const res = await fetch("http://localhost:3000/leads");
    const leads = await res.json();

    for (const lead of leads) {
      const res = await fetch(`http://localhost:3000/loans/full/${lead.lead_id}`);
      const full = await res.json();

      const loan = full.loan || {};
      const docs = full.documents || [];

      const div = document.createElement("div");
      div.className = "lead-card";
      div.innerHTML = `
        <strong>${lead.first_name} ${lead.last_name}</strong><br/>
        Phone: ${lead.phone}<br/>
        Email: ${lead.email}<br/>
        Loan: ₹${loan.amount ?? 'N/A'} @ ${loan.interest_rate ?? 'N/A'}% for ${loan.tenure ?? 'N/A'} months<br/>
        ${docs.map((doc, i) =>
          `<a href="http://localhost:3000/documents/view/${doc.filename}" target="_blank">Document ${i + 1}</a>`
        ).join(" | ")}<br/>
        <button onclick="deleteLead(${lead.lead_id})">🗑️ Delete</button>
      `;
      leadsList.appendChild(div);
    }
  } catch (err) {
    leadsList.innerText = "❌ Failed to load leads: " + err.message;
    console.error(err);
  }
}

async function deleteLead(id) {
  if (!confirm("Delete this lead?")) return;
  await fetch(`http://localhost:3000/leads/${id}`, { method: "DELETE" });
  loadLeads();
}

window.onload = loadLeads;
