
async function fetchUsers() {
  try {
    const response = await fetch('/api/admin/users', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const users = await response.json();
    const userList = document.getElementById('user-list');
    if (userList) {
      userList.innerHTML = users.length ? users.map(u => {
        // Defensive check for isActive (handle boolean or string)
        const isActive = u.isActive === true || u.isActive === 'true';

        return `
          <li class="border p-3 rounded-md bg-gray-50 mb-2">
            <strong>ID:</strong> ${u.id}<br>
            <strong>Email:</strong> ${u.email}<br>
            <strong>Name:</strong> ${u.name}<br>
            <strong>Role:</strong> ${u.role}<br>
            <strong>Active:</strong> ${isActive ? 'Yes' : 'No'}<br>
            ${u.id !== 1 ? `
              ${!isActive ? `<button class="activate-btn bg-green-500 text-white px-3 py-1 rounded mr-2" data-userid="${u.id}">Activate</button>` : ''}
              ${isActive ? `<button class="deactivate-btn bg-red-500 text-white px-3 py-1 rounded" data-userid="${u.id}">Deactivate</button>` : ''}
            ` : ''}
          </li>
        `;
      }).join('') : '<li>No users found</li>';
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    alert('Failed to load users');
  }
}


async function fetchLogs() {
  try {
    const response = await fetch('/api/admin/logs', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const logs = await response.json();
    const logList = document.getElementById('log-list');
    if (logList) {
      logList.innerHTML = logs.length ? logs.map(l => `
        <li>
          User: ${l.user.email}<br>
          Action: ${l.action}<br>
          Timestamp: ${new Date(l.timestamp).toLocaleString()}<br>
          IP: ${l.ipAddress}<br>
          Details: ${l.details || 'None'}
        </li>
      `).join('') : '<li>No logs found</li>';
    }
  } catch (error) {
    console.error('Error fetching logs:', error);
    alert('Failed to load logs');
  }
}

async function fetchAppointments() {
  try {
    const response = await fetch('/api/admin/appointments', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const appointments = await response.json();
    const appointmentList = document.getElementById('appointment-list');
    if (appointmentList) {
      appointmentList.innerHTML = appointments.length ? appointments.map(a => `
        <li class="border p-3 rounded-md bg-white">
          <strong>ID:</strong> ${a.id}<br>
          <strong>Patient:</strong> ${a.patient ? a.patient.name : 'Unknown'}<br>
          <strong>Doctor:</strong>  ${a.doctor ? a.doctor.name : 'Unknown'}<br>
          <strong>Date:</strong> ${new Date(a.date).toLocaleString()}<br>
          <strong>Status:</strong> ${a.status}
        </li>
      `).join('') : '<li>No appointments found</li>';
    }
  } catch (error) {
    console.error('Error fetching appointments:', error);
    alert('Failed to load appointments');
  }
}

async function fetchPrescriptions() {
  try {
    const response = await fetch('/api/admin/prescriptions', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const prescriptions = await response.json();
    const prescriptionList = document.getElementById('prescription-list');

    if (prescriptionList) {
      prescriptionList.innerHTML = prescriptions.length ? prescriptions.map(p => {
        const patientName = p.patient ? p.patient.name : 'Unknown';
        const doctorName = p.doctor ? p.doctor.name : 'Unknown';
        const date = p.createdAt ? new Date(p.createdAt).toLocaleString() : 'Unknown';

        return `
          <li class="border p-3 rounded-md bg-white">
            <strong>ID:</strong> ${p.id}<br>
            <strong>Patient:</strong> ${patientName}<br>
            <strong>Doctor:</strong> ${doctorName}<br>
            <strong>Date:</strong> ${date}<br>
          </li>
        `;
      }).join('') : '<li>No prescriptions found</li>';
    }
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    alert('Failed to load prescriptions');
  }
}

const roleForm = document.getElementById('role-form');
if (roleForm) {
  roleForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const userId = document.getElementById('userId').value;
      const role = document.getElementById('role').value;

      const response = await fetch('/api/admin/users/role', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, role })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const user = await response.json();
      alert('User role updated successfully');
      roleForm.reset();
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Failed to update user role');
    }
  });
}
function downloadLogs(format) {
  window.open(`/api/admin/logs/export/${format}`, '_blank');
}

document.addEventListener('DOMContentLoaded', () => {
  fetchUsers();
  fetchLogs();
  fetchAppointments();
  fetchPrescriptions();
});

document.getElementById('user-list').addEventListener('click', async (event) => {
  const target = event.target;
  if (target.classList.contains('activate-btn') || target.classList.contains('deactivate-btn')) {
    const userId = target.dataset.userid;
    const activate = target.classList.contains('activate-btn');
    try {
      const url = activate ? '/api/admin/users/activate' : '/api/admin/users/deactivate';
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      alert(data.message || (activate ? 'User activated' : 'User deactivated'));

      fetchUsers(); // Refresh the list after status change
    } catch (error) {
      console.error('Error toggling user active status:', error);
      alert('Failed to update user status');
    }
  }
});
