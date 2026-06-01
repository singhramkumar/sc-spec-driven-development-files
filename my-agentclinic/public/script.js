document.addEventListener('DOMContentLoaded', () => {
    const agentsGrid = document.getElementById('agentsGrid');
    const createAgentBtn = document.getElementById('createAgentBtn');
    const agentModal = document.getElementById('agentModal');
    const closeModal = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const agentForm = document.getElementById('agentForm');
    const modalTitle = document.getElementById('modalTitle');

    let editingAgentId = null;

    fetchAgents();

    createAgentBtn.addEventListener('click', openCreateModal);
    closeModal.addEventListener('click', closeAgentModal);
    cancelBtn.addEventListener('click', closeAgentModal);
    agentForm.addEventListener('submit', handleFormSubmit);

    window.addEventListener('click', (event) => {
        if (event.target === agentModal) {
            closeAgentModal();
        }
    });

    async function fetchAgents() {
        try {
            const response = await fetch('/agents');
            if (!response.ok) throw new Error('Failed to fetch agents');
            const agents = await response.json();
            renderAgents(agents);
        } catch (error) {
            agentsGrid.innerHTML = `<p class="error">Error loading agents: ${error.message}</p>`;
        }
    }

    function renderAgents(agents) {
        if (agents.length === 0) {
            agentsGrid.innerHTML = '<p class="loading">No agents yet. Create one to get started!</p>';
            return;
        }

        agentsGrid.innerHTML = agents.map(agent => `
            <div class="agent-card">
                <h3 class="agent-card-title">${escapeHtml(agent.name)}</h3>
                <div class="agent-card-detail">
                    <span class="agent-detail-label">Email:</span>
                    <span class="agent-detail-value">${escapeHtml(agent.email)}</span>
                </div>
                <div class="agent-card-detail">
                    <span class="agent-detail-label">Specialty:</span>
                    <span class="agent-detail-value">${escapeHtml(agent.specialty)}</span>
                </div>
                <div class="agent-card-detail">
                    <span class="agent-detail-label">Status:</span>
                    <span class="agent-status status-${agent.status}">${escapeHtml(agent.status)}</span>
                </div>
                <div class="agent-card-detail">
                    <span class="agent-detail-label">Created:</span>
                    <span class="agent-detail-value">${new Date(agent.createdAt).toLocaleDateString()}</span>
                </div>
                <div class="agent-actions">
                    <button class="btn btn-primary" onclick="editAgent('${agent.id}')">Edit</button>
                    <button class="btn btn-secondary" onclick="viewAgent('${agent.id}')">View</button>
                </div>
            </div>
        `).join('');
    }

    function openCreateModal() {
        editingAgentId = null;
        modalTitle.textContent = 'Create New Agent';
        agentForm.reset();
        agentModal.style.display = 'flex';
    }

    function closeAgentModal() {
        agentModal.style.display = 'none';
        agentForm.reset();
        editingAgentId = null;
    }

    async function handleFormSubmit(e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById('agentName').value,
            email: document.getElementById('agentEmail').value,
            specialty: document.getElementById('agentSpecialty').value,
            status: document.getElementById('agentStatus').value
        };

        try {
            if (editingAgentId) {
                await updateAgent(editingAgentId, formData);
            } else {
                await createAgent(formData);
            }
            closeAgentModal();
            fetchAgents();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }

    async function createAgent(data) {
        const response = await fetch('/agents', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create agent');
        }

        return response.json();
    }

    async function updateAgent(id, data) {
        const response = await fetch(`/agents/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to update agent');
        }

        return response.json();
    }

    window.editAgent = async function(id) {
        try {
            const response = await fetch(`/agents/${id}`);
            if (!response.ok) throw new Error('Failed to fetch agent');
            const agent = await response.json();

            editingAgentId = id;
            modalTitle.textContent = 'Edit Agent';
            document.getElementById('agentName').value = agent.name;
            document.getElementById('agentEmail').value = agent.email;
            document.getElementById('agentSpecialty').value = agent.specialty;
            document.getElementById('agentStatus').value = agent.status;
            agentModal.style.display = 'flex';
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    window.viewAgent = async function(id) {
        alert(`Viewing agent ${id} - View details page (coming soon!)`);
    };

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});
