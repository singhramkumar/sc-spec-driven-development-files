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
        try {
            const response = await fetch(`/agents/${id}`);
            if (!response.ok) throw new Error('Failed to fetch agent');
            const agent = await response.json();
            openAgentDetailModal(agent);
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    function openAgentDetailModal(agent) {
        document.getElementById('detailAgentName').textContent = agent.name;
        document.getElementById('detailAgentEmail').textContent = agent.email;
        document.getElementById('detailAgentSpecialty').textContent = agent.specialty;
        const statusSpan = document.getElementById('detailAgentStatus');
        statusSpan.textContent = agent.status;
        statusSpan.className = `agent-status status-${agent.status}`;

        // Fetch and display ailments
        fetchAilmentsForAgent(agent.id);

        // Store current agent ID for ailment operations
        window.currentAgentId = agent.id;

        document.getElementById('agentDetailModal').style.display = 'flex';
    }

    async function fetchAilmentsForAgent(agentId) {
        try {
            const response = await fetch(`/agents/${agentId}/ailments`);
            if (!response.ok) throw new Error('Failed to fetch ailments');
            const ailments = await response.json();
            renderAilments(ailments);
        } catch (error) {
            document.getElementById('ailmentsList').innerHTML = `<p class="error">Error loading ailments: ${error.message}</p>`;
        }
    }

    function renderAilments(ailments) {
        const ailmentsList = document.getElementById('ailmentsList');

        if (!ailments || ailments.length === 0) {
            ailmentsList.innerHTML = '<p class="empty-ailments">No ailments recorded yet.</p>';
            return;
        }

        ailmentsList.innerHTML = ailments.map(ailment => `
            <div class="ailment-item">
                <div class="ailment-header">
                    <div class="ailment-title">${escapeHtml(ailment.name)}</div>
                    <span class="ailment-status status-${ailment.status}">${ailment.status}</span>
                </div>
                <p class="ailment-description">${escapeHtml(ailment.description)}</p>
                <div class="ailment-meta">
                    <span class="ailment-severity severity-${ailment.severity}">${ailment.severity}</span>
                    <span style="color: var(--text-light); font-size: 0.875rem;">Added: ${new Date(ailment.createdAt).toLocaleDateString()}</span>
                </div>
                <div class="ailment-actions">
                    ${ailment.status === 'active' ? `<button class="btn btn-primary" onclick="resolveAilment('${ailment.id}')">Resolve</button>` : ''}
                    <button class="btn btn-secondary" onclick="deleteAilment('${ailment.id}')">Delete</button>
                </div>
            </div>
        `).join('');
    }

    window.resolveAilment = async function(ailmentId) {
        try {
            const agentId = window.currentAgentId;
            const response = await fetch(`/agents/${agentId}/ailments/${ailmentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'resolved' })
            });
            if (!response.ok) throw new Error('Failed to resolve ailment');
            fetchAilmentsForAgent(agentId);
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    window.deleteAilment = async function(ailmentId) {
        if (!confirm('Are you sure you want to delete this ailment?')) return;

        try {
            const agentId = window.currentAgentId;
            const response = await fetch(`/agents/${agentId}/ailments/${ailmentId}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete ailment');
            fetchAilmentsForAgent(agentId);
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    // Ailment form handling
    const ailmentForm = document.getElementById('ailmentForm');
    const cancelAilmentBtn = document.getElementById('cancelAilmentBtn');

    ailmentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            const agentId = window.currentAgentId;
            const formData = {
                name: document.getElementById('ailmentName').value,
                description: document.getElementById('ailmentDescription').value,
                severity: document.getElementById('ailmentSeverity').value
            };

            const response = await fetch(`/agents/${agentId}/ailments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to create ailment');
            }

            ailmentForm.reset();
            fetchAilmentsForAgent(agentId);
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    });

    cancelAilmentBtn.addEventListener('click', () => {
        ailmentForm.reset();
    });

    // Detail modal close handlers
    const closeDetailModal = document.getElementById('closeDetailModal');
    closeDetailModal.addEventListener('click', () => {
        document.getElementById('agentDetailModal').style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        const detailModal = document.getElementById('agentDetailModal');
        if (event.target === detailModal) {
            detailModal.style.display = 'none';
        }
    });

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});
